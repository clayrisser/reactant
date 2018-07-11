import _ from 'lodash';
import loglevel from 'loglevel';
import { Logger, transports } from 'winston';
import { runtime } from 'js-info';

const log = createLogger();

function createLogger() {
  if (runtime.node) {
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
  loglevel.setLevel(
    _.get(window, 'reaction.config.env') === 'production' ? 'error' : 'info'
  );
  return loglevel;
}

export function setLevel(level) {
  if (runtime.node) {
    log.level = level;
  } else {
    log.setLevel(level);
  }
}

export default log;
