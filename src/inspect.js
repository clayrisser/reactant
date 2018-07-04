import _ from 'lodash';
import { getRuntime } from 'cross-environment';
import { log } from 'reaction-base';

export default function inspect(...args) {
  log.info(...args);
  if (getRuntime() === 'browser') {
    // eslint-disable-next-line no-undef
    const browserWindow = window;
    if (browserWindow.reaction) {
      let item = args;
      if (args.length) {
        if (args.length === 1) {
          [item] = args;
        } else if (args.length === 2) {
          [, item] = args;
        } else if (_.isString(args[0])) {
          item.shift();
        }
      }
      if (!browserWindow.reaction.inspect) browserWindow.reaction.inspect = {};
      browserWindow.reaction.inspect[
        args.length > 1 && _.isString(args[0])
          ? args[0]
          : _.get(browserWindow, 'reaction.inspect.length', 1) - 1
      ] = item;
    }
  }
}
