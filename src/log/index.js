import _ from 'lodash';
import loglevel from 'loglevel';
import { Logger, transports } from 'winston';

const log = createLogger();

function createLogger() {
  if (isBrowser()) {
    loglevel.setLevel(
      // eslint-disable-next-line no-undef
      _.get(window, 'reaction.config.environment') === 'production'
        ? 'error'
        : 'info'
    );
    return loglevel;
  }
  return new Logger({
    level: 'info',
    exitOnError: false,
    transports: [
      new transports.Console({
        prettyPrint: true,
        colorize: true,
        showLevel: false
      })
    ]
  });
}

export function setLevel(level) {
  if (isBrowser()) {
    log.setLevel(level);
  } else {
    log.level = level;
  }
}

// eslint-disable-next-line no-new-func
const isBrowser = new Function(
  'try { return this === window } catch (e) { return false }'
);

export default log;
