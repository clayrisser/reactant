import { resolvePath } from '../util';

module.exports = {
  extends: [
    'airbnb-typescript',
    resolvePath('../lib/typescript/base', './base'),
    resolvePath('../lib/rules/jest', '../rules/jest'),
    resolvePath('../lib/rules/react', '../rules/react')
  ]
};
