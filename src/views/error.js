import ignoreWarnings from 'ignore-warnings';
import log from '../log';

// eslint-disable-next-line no-undef
const browserWindow = window;

browserWindow.document.title = browserWindow.reaction.config.title;

ignoreWarnings('react-error-overlay is not meant for use in production');

const {
  reportBuildError,
  startReportingRuntimeErrors
} = require('react-error-overlay');

log.error(browserWindow.reaction.errStack);

startReportingRuntimeErrors({});
reportBuildError(browserWindow.reaction.errStack);
