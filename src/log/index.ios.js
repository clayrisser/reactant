const log = createLogger();

function createLogger() {
  // eslint-disable-next-line no-console
  return console.log;
}

export function setLevel(level) {
  log.level = level;
}

export default log;
