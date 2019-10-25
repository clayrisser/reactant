import { resolvePath } from './util';

module.exports = {
  extends: [
    'airbnb',
    resolvePath('./lib/base', './base'),
    resolvePath('./lib/rules/jest', './rules/jest'),
    resolvePath('./lib/rules/react', './rules/react')
  ]
};
