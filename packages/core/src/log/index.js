import { runtime } from 'js-info';

const logger = createLogger();

export function createLogger(engine = runtime.node ? 'winston' : 'loglevel') {
  if (engine === 'winston') {
    return require('./winston');
  }
  return require('./loglevel');
}

export const { setLevel } = logger;
export default logger.default;
