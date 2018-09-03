import _ from 'lodash';
import { log } from '@reactant/base';
import { runtime } from 'js-info';

export default function inspect(...args) {
  log.info(...args);
  if (runtime.browser) {
    if (window.reactant) {
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
      if (!window.reactant.inspect) window.reactant.inspect = {};
      window.reactant.inspect[
        args.length > 1 && _.isString(args[0])
          ? args[0]
          : _.get(window, 'reactant.inspect.length', 1) - 1
      ] = item;
    }
  }
}
