import config from 'reaction-base/lib/config';
import loglevel from 'loglevel';

const log = createLogger();

function createLogger() {
  loglevel.setLevel(config.environment === 'production' ? 'error' : 'info');
  return loglevel;
}

export function setLevel(...args) {
  log.setLevel(...args);
}

export default log;
