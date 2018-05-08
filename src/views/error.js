import 'babel-polyfill';
import ignoreWarnings from 'ignore-warnings';
import HotClient from '../hotClient';
import log, { setLevel } from '../log';

// eslint-disable-next-line no-undef
const browserWindow = window;

browserWindow.document.title = browserWindow.reaction.config.title;

ignoreWarnings('react-error-overlay is not meant for use in production');

let hash = null;
const { config } = browserWindow.reaction;

if (config.options.verbose) setLevel('verbose');
if (config.options.debug) setLevel('debug');

const {
  reportBuildError,
  startReportingRuntimeErrors
} = require('react-error-overlay');

log.error(browserWindow.reaction.errStack);

startReportingRuntimeErrors({});
reportBuildError(browserWindow.reaction.errStack);

log.debug('connecting . . .');
const client = new HotClient({ port: config.ports.dev });
client.onConnected = async () => {
  log.debug('connected');
};
client.onHash = async message => {
  log.debug('hash', hash);
  if (hash) windowReload();
  hash = message.data;
};
client.onContentChanged = () => {
  log.debug('content-changed');
  windowReload();
};
client.onClose = () => {
  log.debug('close');
  log.info(
    'The development server has disconnected.\n' +
      'Refresh the page if necessary.'
  );
};

function windowReload() {
  if (config.options.debug) {
    log.debug('reloading window . . .');
  } else {
    setTimeout(() => {
      browserWindow.location.reload();
    }, 1000);
  }
}
