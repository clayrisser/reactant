import _ from 'lodash';
import { Platform } from 'react-native';

const log = createLogger();

function createLogger() {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line global-require
    const { getRuntime } = require('cross-environment');
    // eslint-disable-next-line global-require
    const loglevel = require('loglevel');
    if (getRuntime() === 'browser') {
      loglevel.setLevel(
        // eslint-disable-next-line no-undef
        _.get(window, 'reaction.config.environment') === 'production'
          ? 'error'
          : 'info'
      );
      return loglevel;
    }
    // eslint-disable-next-line global-require
    const { Logger, transports } = require('winston');
    return new Logger({
      level: 'info',
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
  // eslint-disable-next-line no-console
  return console.log;
}

export function setLevel(level) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line global-require
    const { getRuntime } = require('cross-environment');
    if (getRuntime() === 'browser') {
      log.setLevel(level);
    } else {
      log.level = level;
    }
  }
}

export default log;
