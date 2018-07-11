import _ from 'lodash';
import loglevel from 'loglevel';

const log = createLogger();

function createLogger() {
  loglevel.setLevel(
    _.get(window, 'reaction.config.env') === 'production' ? 'error' : 'info'
  );
  return loglevel;
}

export function setLevel(level) {
  log.setLevel(level);
}

export default log;
