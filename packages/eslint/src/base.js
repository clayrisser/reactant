import { resolvePath } from './util';

module.exports = {
  extends: [
    'airbnb/base',
    'prettier',
    resolvePath('./lib/rules/base', './rules/base')
  ],
  parser: 'babel-eslint'
};
