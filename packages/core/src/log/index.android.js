const logger = createLogger();

function createLogger() {
  return require('./loglevel');
}

export const { setLevel } = logger;
export default logger.default;
