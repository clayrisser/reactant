import winston from 'winston';

const log = new winston.Logger({
  level: 'info',
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      prettyPrint: true,
      colorize: true,
      showLevel: false
    })
  ]
});

export function setLevel(level) {
  log.level = level;
}

export default log;
