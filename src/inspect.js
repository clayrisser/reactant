import _ from 'lodash';
import { runtime } from 'js-info';
import { log } from 'reaction-base';

export default function inspect(...args) {
  log.info(...args);
  if (runtime.browser) {
    if (window.reaction) {
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
      if (!window.reaction.inspect) window.reaction.inspect = {};
      window.reaction.inspect[
        args.length > 1 && _.isString(args[0])
          ? args[0]
          : _.get(window, 'reaction.inspect.length', 1) - 1
      ] = item;
    }
  }
}
