import { runtime } from 'js-info';

const log = createLogger();

function createLogger() {
  if (runtime.node) {
    const { Logger, transports } = require('winston');
    return new Logger({
      level: 'debug',
      levels: {
        trace: 5
      },
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
  const loglevel = require('loglevel');
  loglevel.setLevel('debug');
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
