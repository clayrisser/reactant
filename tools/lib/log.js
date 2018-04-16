import winston from 'winston';

export default new winston.Logger({
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
