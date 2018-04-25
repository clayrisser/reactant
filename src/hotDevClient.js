import _ from 'lodash';
// eslint-disable-next-line import/no-unresolved
import config from 'reaction/config';
import stripAnsi from 'strip-ansi';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint';
// eslint-disable-next-line import/no-unresolved
import log from 'reaction/log';
import SockjsClient from 'sockjs-client';
import { format as urlFormat } from 'url';
import {
  dismissBuildError,
  reportBuildError,
  startReportingRuntimeErrors,
  stopReportingRuntimeErrors
} from 'react-error-overlay';

// eslint-disable-next-line no-undef
const browserWindow = window;

let hadRuntimeError = false;
let isFirstCompilation = true;
let hash = null;
let hasCompileErrors = false;

startReportingRuntimeErrors({
  launchEditorEndpoint: urlFormat({
    protocol: browserWindow.location.protocol,
    hostname: browserWindow.location.hostname,
    port: config.devPort,
    pathname: launchEditorEndpoint
  }),
  onError: () => {
    hadRuntimeError = true;
    return true;
  },
  filename: `${config.paths.distPublic}/scripts/bundle.js`
});

if (module.hot && _.isFunction(module.hot.dispose)) {
  module.hot.dispose(() => stopReportingRuntimeErrors());
}

createConnection(config.devPort, {
  async hash(message) {
    hash = message.data;
    log.debug('hash', hash);
  },
  async stillOk() {
    log.debug('still-ok');
  },
  async ok() {
    log.debug('applying updates . . .');
    try {
      await handleSuccess();
      log.debug('updates applied');
    } catch (err) {
      log.error(err);
    }
  },
  async contentChanged() {
    log.debug('content-changed');
    browserWindow.location.reload();
  },
  async warnings(message) {
    handleWarnings(message.data);
  },
  async errors(message) {
    handleErrors(message.data);
  }
});

async function handleSuccess() {
  clearOutdatedErrors();
  const isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;
  if (isHotUpdate) {
    await applyUpdates();
    dismissBuildError();
  }
}

async function handleErrors(errors) {
  clearOutdatedErrors();
  isFirstCompilation = false;
  hasCompileErrors = true;
  const formatted = formatWebpackMessages({ errors, warnings: [] });
  reportBuildError(formatted.errors[0]);
  _.each(formatted.errors, (error, index) => {
    if (index < formatted.errors.length) {
      if (index === 5) {
        log.error(
          'There were more errors in other files.\n' +
            'You can find a complete log in the terminal.'
        );
      }
      log.error(stripAnsi(error));
      return true;
    }
    return false;
  });
}

async function handleWarnings(warnings) {
  clearOutdatedErrors();
  const isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;
  function printWarnings() {
    const formatted = formatWebpackMessages({ warnings, errors: [] });
    _.each(formatted.warnings, (warning, index) => {
      if (index < formatted.warnings.length) {
        if (index === 5) {
          log.warn(
            'There were more warnings in other files.\n' +
              'You can find a complete log in the terminal.'
          );
        }
        log.warn(stripAnsi(warning));
      }
    });
  }
  if (isHotUpdate) {
    await applyUpdates();
    printWarnings();
    dismissBuildError();
  } else {
    printWarnings();
  }
}

async function applyUpdates() {
  if (!module.hot) return browserWindow.location.reload();
  if (!isUpdateAvailable() || !canApplyUpdates()) return false;
  return new Promise((resolve, reject) => {
    function handleApplyUpdates(err, updatedModules) {
      if (err) {
        if (!/Aborted\sbecause.+\sis\snot\saccepted/.test(err.message)) {
          browserWindow.location.reload();
        }
        return reject(err);
      }
      if (!updatedModules || hadRuntimeError) {
        browserWindow.location.reload();
        return reject(new Error('runtime error'));
      }
      if (isUpdateAvailable()) {
        return applyUpdates().then(() => {
          return resolve();
        });
      }
      return resolve();
    }
    const result = module.hot.check(true, handleApplyUpdates);
    if (result && result.then) {
      return result
        .then(updatedModules => {
          handleApplyUpdates(null, updatedModules);
        })
        .catch(err => {
          handleApplyUpdates(err, null);
        });
    }
    return result;
  });
}

function isUpdateAvailable() {
  // eslint-disable-next-line camelcase,no-undef
  return hash !== __webpack_hash__;
}

function canApplyUpdates() {
  return module.hot.status() === 'idle';
}

function clearOutdatedErrors() {
  // eslint-disable-next-line no-console
  if (hasCompileErrors) console.clear();
}

function createConnection(
  port,
  {
    hash = () => {},
    stillOk = () => {},
    ok = () => {},
    contentChanged = () => {},
    warnings = () => {},
    errors = () => {}
  }
) {
  const connection = new SockjsClient(
    urlFormat({
      protocol: browserWindow.location.protocol,
      hostname: browserWindow.location.hostname,
      port,
      pathname: '/sockjs-node'
    })
  );
  connection.onclose = () => {
    return log.info(
      'The development server has disconnected.\n' +
        'Refresh the page if necessary.'
    );
  };
  connection.onmessage = e => {
    const message = JSON.parse(e.data);
    switch (message.type) {
      case 'hash':
        hash(message);
        break;
      case 'still-ok':
        stillOk(message);
        break;
      case 'ok':
        ok(message);
        break;
      case 'content-changed':
        contentChanged(message);
        break;
      case 'warnings':
        warnings(message);
        break;
      case 'errors':
        errors(message);
        break;
    }
  };
  return connection;
}
