import _ from 'lodash';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import stripAnsi from 'strip-ansi';
import { config, log } from 'reaction-base';
import {
  dismissBuildError,
  reportBuildError,
  startReportingRuntimeErrors,
  stopReportingRuntimeErrors
} from 'react-error-overlay';
import HotClient from './hotClient';

if (config.options.debug) window.module = module;

let hadServerError = false;
let hadError = false;
let hash = null;
let isFirstCompilation = true;

startReportingRuntimeErrors({
  onError: () => {
    hadError = true;
    return true;
  },
  filename: `${config.paths.distWebPublic}/scripts/bundle.js`
});
if (module.hot && _.isFunction(module.hot.dispose)) {
  module.hot.dispose(() => stopReportingRuntimeErrors());
}

const client = new HotClient({ port: config.ports.dev });
client.onConnected = async () => {
  log.trace('connected');
};
client.onHash = async message => {
  if (hash) log.debug('hot reloading');
  log.trace('hash', hash);
  hash = message.data;
};
client.onStillOk = async () => {
  log.trace('still-ok');
};
client.onOk = async () => {
  log.trace('ok');
  await handleSuccess();
};
client.onContentChanged = () => {
  log.trace('content-changed');
  windowReload();
};
client.onWarngins = message => {
  log.trace('warnings');
  handleWarnings(message.data);
};
client.onErrors = message => {
  log.trace('errors');
  handleErrors(message.data);
};
client.onClose = () => {
  log.trace('close');
  log.debug(
    'The development server has disconnected.\n' +
      'Refresh the page if necessary.'
  );
};

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

window.hothot = module.hot;

async function applyUpdates() {
  if (!module.hot) return windowReload();
  if (!isUpdateAvailable() || module.hot.status() !== 'idle') return false;
  return new Promise((resolve, reject) => {
    function handleApplyUpdates(err, _updatedModules) {
      if (err && !hadServerError) return reject(err);
      if (hadServerError) hadServerError = false;
      if (isUpdateAvailable()) applyUpdates().then(() => resolve());
      return resolve();
    }
    const result = module.hot.check(true, handleApplyUpdates);
    if (result && result.then) {
      return result
        .then(updatedModules => handleApplyUpdates(null, updatedModules))
        .catch(err => handleApplyUpdates(err, null));
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
    windowReload();
  } else if (hadError) {
    hadError = false;
    consoleClear();
    dismissBuildError();
  }
}

function windowReload() {
  if (config.options.debug) {
    log.debug('reloading window');
  } else {
    window.location.reload();
  }
}

function consoleClear() {
  if (config.options.debug) {
    log.debug('cleared console');
  } else {
    // eslint-disable-next-line no-console
    console.clear();
  }
}
