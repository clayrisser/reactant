import SockjsClient from 'sockjs-client';
// eslint-disable-next-line import/no-unresolved
import config from 'reaction/config';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint';
import log from '~/log';
import stripAnsi from 'strip-ansi';
import { format } from 'url';
import {
  dismissBuildError,
  reportBuildError,
  startReportingRuntimeErrors,
  stopReportingRuntimeErrors
} from 'react-error-overlay';

// eslint-disable-next-line no-undef
const browserWindow = window;

let hadRuntimeError = false;
let hasCompileErrors = false;
let isFirstCompilation = true;
let mostRecentCompilationHash = null;

startReportingRuntimeErrors({
  launchEditorEndpoint: format({
    protocol: browserWindow.location.protocol,
    hostname: browserWindow.location.hostname,
    port: config.devPort,
    pathname: launchEditorEndpoint
  }),
  onError() {
    hadRuntimeError = true;
  },
  filename:
    `${config.paths.distPublic}/scripts/bundle.js` || '/scripts/bundle.js'
});

if (module.hot && typeof module.hot.dispose === 'function') {
  module.hot.dispose(() => stopReportingRuntimeErrors());
}

const connection = new SockjsClient(
  format({
    protocol: browserWindow.location.protocol,
    hostname: browserWindow.location.hostname,
    port: config.devPort,
    pathname: '/sockjs-node'
  })
);

connection.onclose = () => {
  log.info(
    'The development server has disconnected.\nRefresh the page if necessary.'
  );
};

function clearOutdatedErrors() {
  // eslint-disable-next-line no-console
  if (hasCompileErrors) console.clear();
}

function handleSuccess() {
  clearOutdatedErrors();
  const isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;
  if (isHotUpdate) {
    tryApplyUpdates(() => dismissBuildError());
  }
}

function handleWarnings(warnings) {
  clearOutdatedErrors();
  const isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;
  function printWarnings() {
    const formatted = formatWebpackMessages({
      warnings,
      errors: []
    });
    for (let i = 0; i < formatted.warnings.length; i++) {
      if (i === 5) {
        log.warn(
          'There were more warnings in other files.\n' +
            'You can find a complete log in the terminal.'
        );
        break;
      }
      log.warn(stripAnsi(formatted.warnings[i]));
    }
  }
  if (isHotUpdate) {
    tryApplyUpdates(() => {
      printWarnings();
      dismissBuildError();
    });
  } else {
    printWarnings();
  }
}

function handleErrors(errors) {
  clearOutdatedErrors();
  isFirstCompilation = false;
  hasCompileErrors = true;
  const formatted = formatWebpackMessages({
    errors,
    warnings: []
  });
  reportBuildError(formatted.errors[0]);
  for (let i = 0; i < formatted.errors.length; i++) {
    log.error(stripAnsi(formatted.errors[i]));
  }
}

function handleAvailableHash(hash) {
  mostRecentCompilationHash = hash;
}

connection.onmessage = e => {
  const message = JSON.parse(e.data);
  switch (message.type) {
    case 'hash':
      handleAvailableHash(message.data);
      break;
    case 'still-ok':
    case 'ok':
      handleSuccess();
      break;
    case 'content-changed':
      browserWindow.location.reload();
      break;
    case 'warnings':
      handleWarnings(message.data);
      break;
    case 'errors':
      handleErrors(message.data);
      break;
  }
};

function isUpdateAvailable() {
  // eslint-disable-next-line camelcase,no-undef
  return mostRecentCompilationHash !== __webpack_hash__;
}

function canApplyUpdates() {
  return module.hot.status() === 'idle';
}

function tryApplyUpdates(onHotUpdateSuccess) {
  if (!module.hot) return browserWindow.location.reload();
  if (!isUpdateAvailable() || !canApplyUpdates()) return null;
  function handleApplyUpdates(err, updatedModules) {
    if (err || !updatedModules || hadRuntimeError) {
      return browserWindow.location.reload();
    }
    if (typeof onHotUpdateSuccess === 'function') onHotUpdateSuccess();
    if (isUpdateAvailable()) tryApplyUpdates();
    return null;
  }
  const result = module.hot.check(true, handleApplyUpdates);
  if (result && result.then) {
    result.then(
      updatedModules => handleApplyUpdates(null, updatedModules),
      err => handleApplyUpdates(err, null)
    );
  }
  return null;
}
