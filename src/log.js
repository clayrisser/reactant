import { Logger, transports } from 'winston';
import loglevel from 'loglevel';
import { getRuntime } from 'cross-environment';
import _ from 'lodash';

const log = createLogger();

function createLogger() {
  if (getRuntime() === 'browser') {
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
  if (getRuntime() === 'browser') {
    log.setLevel(level);
  } else {
    log.level = level;
  }
}

export default log;
