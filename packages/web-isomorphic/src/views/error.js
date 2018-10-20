import 'babel-polyfill';
import HMRClient from 'hmr-client';
import ignoreWarnings from 'ignore-warnings';
import log, { setLevel } from '@reactant/core/log';

window.document.title = window.reactant.config.title;
ignoreWarnings('react-error-overlay is not meant for use in production');

let hash = null;
const { config } = window.reactant;

if (
  config.options.verbose ||
  config.options.debug ||
  config.level === 'trace'
) {
  setLevel('trace');
} else if (config.env === 'development') {
  setLevel('debug');
} else {
  setLevel(config.level);
}

const {
  reportBuildError,
  startReportingRuntimeErrors
} = require('react-error-overlay');

log.error(window.reactant.errStack);

startReportingRuntimeErrors({});
reportBuildError(window.reactant.errStack);

log.trace('connecting . . .');
const client = new HMRClient({ port: config.ports.dev });
client.onConnected = async () => {
  log.trace('connected');
};
client.onHash = async message => {
  log.trace('hash', hash);
  if (hash) windowReload();
  hash = message.data;
};
client.onContentChanged = () => {
  log.trace('content-changed');
  windowReload();
};
client.onClose = () => {
  log.trace('close');
  log.debug(
    'The development server has disconnected.\n' +
      'Refresh the page if necessary.'
  );
};

function windowReload() {
  if (config.options.debug) {
    log.trace('reloading window . . .');
  } else {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
