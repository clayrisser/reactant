import loglevel from 'loglevel';

const log = createLogger();

function createLogger() {
  loglevel.setLevel('debug');
  return loglevel;
}

export function setLevel(level) {
  log.setLevel(level);
}

export default log;
