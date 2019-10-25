import { resolvePath } from '../util';

module.exports = {
  extends: [
    'airbnb-typescript/base',
    'prettier',
    resolvePath('../lib/rules/base', '../rules/base')
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/indent': 'off',
    'import/prefer-default-export': 'off',
    'no-empty-function': ['error', { allow: ['constructors'] }],
    'no-useless-constructor': 'off'
  }
};
