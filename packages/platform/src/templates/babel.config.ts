// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { createBabelConfig } from '@reactant/platform';

module.exports = function (api: any) {
  api.cache(true);
  return createBabelConfig();
};
