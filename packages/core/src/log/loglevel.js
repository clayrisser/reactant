import loglevel from 'loglevel';

const log = createLogger();
let silly = false;

function createLogger() {
  loglevel.silly = (...props) => {
    if (silly) return loglevel.debug(...props);
    return null;
  };
  loglevel.setLevel('info');
  return loglevel;
}

export function setLevel(level) {
  if (level === 'trace') {
    silly = true;
    log.setLevel('trace');
  } else if (level === 'silly') {
    silly = true;
    log.setLevel('debug');
  } else {
    silly = false;
    log.setLevel(level);
  }
}

export default log;
