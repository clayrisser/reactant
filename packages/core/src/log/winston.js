import { Logger, transports } from 'winston';

const log = createLogger();

function createLogger() {
  return new Logger({
    level: 'info',
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      verbose: 3,
      debug: 4,
      silly: 5,
      trace: 6
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

export function setLevel(level) {
  log.level = level;
}

export default log;
