import 'babel-polyfill';
import ignoreWarnings from 'ignore-warnings';
import log, { setLevel } from 'reaction-base/log';
import HotClient from '../hotClient';

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

log.trace('connecting . . .');
const client = new HotClient({ port: config.ports.dev });
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
      browserWindow.location.reload();
    }, 1000);
  }
}
