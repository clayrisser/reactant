import CircularJSON from 'circular-json';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import { Logger, transports } from 'winston';
import config from '../config';

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

log.write = (label, ...args) => {
  const { options, paths } = config;
  let message = '';
  if (options && options.debug) {
    fs.mkdirsSync(paths.debug);
    if (args.length === 1) {
      const arg = [args];
      if (_.isObject(arg)) {
        message = CircularJSON.stringify(arg, null, 2);
      } else {
        message = CircularJSON.stringify({ message: arg.toString() }, null, 2);
      }
    } else {
      message = CircularJSON.stringify({ message: args.join(' ') }, null, 2);
    }
    fs.writeFileSync(path.resolve(paths.debug, `${label}.json`), message);
  }
  log.debug(`\n\n::: ${label} => `, ...args);
};

export default log;
