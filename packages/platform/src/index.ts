import { Context, PlatformOptions } from '@reactant/types';
import createBabelConfig from './createBabelConfig';
import createWebpackConfig from './createWebpackConfig';

// eslint-disable-next-line no-new-func
const isNode = new Function(
  'try{return this===global}catch(e){return false}'
)();

export function getOptions(): PlatformOptions {
  if (isNode) {
    // eslint-disable-next-line no-eval
    const getContext = eval("require('@reactant/context')").default;
    return (getContext() as Context).platform?.options || {};
  }
  // try {
  //   // eslint-disable-next-line global-require
  //   const options: PlatformOptions = require('@reactant/_platform');
  //   if (options) return options;
  //   // eslint-disable-next-line no-empty
  // } catch (err) {}
  // try {
  //   // eslint-disable-next-line global-require
  //   const options: PlatformOptions = require('../../../.tmp/reactant/platform.json');
  //   if (options) return options;
  //   // eslint-disable-next-line no-empty
  // } catch (err) {}
  const g = window || global || {};
  if (g.__REACTANT__?.platformOptions) {
    return g.__REACTANT__.platformOptions;
  }
  return (null as unknown) as PlatformOptions;
}

export { createBabelConfig, createWebpackConfig };
export * from '@reactant/types';
