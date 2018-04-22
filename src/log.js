import { Logger, transports } from 'winston';
import loglevel from 'loglevel';
import { getRuntime } from 'cross-environment';

const log = createLogger();

function createLogger() {
  if (getRuntime() === 'browser') {
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
