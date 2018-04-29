import SockjsClient from 'sockjs-client';
import _ from 'lodash';
// eslint-disable-next-line import/no-unresolved
import config from 'reaction/config';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
// eslint-disable-next-line import/no-unresolved
import log, { setLevel } from 'reaction/log';
import stripAnsi from 'strip-ansi';
import { format as urlFormat } from 'url';
import {
  dismissBuildError,
  reportBuildError,
  startReportingRuntimeErrors,
  stopReportingRuntimeErrors
} from 'react-error-overlay';

// eslint-disable-next-line no-undef
const browserWindow = window;

if (config.options.verbose) setLevel('verbose');
if (config.options.debug) setLevel('debug');

if (config !== 'production') {
  browserWindow.reaction = { config };
}

let hadServerError = false;
let hadError = false;
let hash = null;
let isFirstCompilation = true;

startReportingRuntimeErrors({
  onError: () => {
    hadError = true;
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
    await handleSuccess();
    log.debug('updates applied');
  },
  async contentChanged() {
    log.debug('content-changed');
    browserWindow.location.reload();
  },
  async warnings(message) {
    log.debug('warnings');
    handleWarnings(message.data);
  },
  async errors(message) {
    log.debug('errors');
    handleErrors(message.data);
  }
});

async function handleSuccess() {
  clearErrors();
  const isHotUpdate = !isFirstCompilation;
  try {
    if (isHotUpdate) {
      await applyUpdates();
      dismissBuildError();
    }
  } catch (err) {
    reportBuildError(err.stack);
    log.error(err);
    hadError = true;
  }
  isFirstCompilation = false;
}

async function handleErrors(errors) {
  clearErrors();
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
  hadServerError = true;
  hadError = true;
  isFirstCompilation = false;
}

async function handleWarnings(warnings) {
  clearErrors();
  const isHotUpdate = !isFirstCompilation;
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
  printWarnings();
  try {
    if (isHotUpdate) {
      await applyUpdates();
      dismissBuildError();
    }
  } catch (err) {
    reportBuildError(err.stack);
    log.error(err);
    hadError = true;
  }
  isFirstCompilation = false;
}

browserWindow.hothot = module.hot;

async function applyUpdates() {
  if (!module.hot) return browserWindow.location.reload();
  if (!isUpdateAvailable() || module.hot.status() !== 'idle') return false;
  return new Promise((resolve, reject) => {
    function handleApplyUpdates(err, _updatedModules) {
      if (err && !hadServerError) return reject(err);
      if (hadServerError) hadServerError = false;
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

function clearErrors() {
  if (module.hot.status() === 'fail') {
    browserWindow.location.reload();
  } else if (hadError) {
    hadError = false;
    // eslint-disable-next-line no-console
    console.clear();
    dismissBuildError();
  }
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
