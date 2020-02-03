import {
  Context,
  CreateConfigOptions,
  Logger,
  PlatformOptions,
  TPlatformApi
} from '@reactant/types';
import createBabelConfig from './createBabelConfig';
import createWebpackConfig from './createWebpackConfig';

class PlatformApi implements TPlatformApi {
  constructor(public context: Context, public logger: Logger) {
    throw new Error('only node can use platform api');
  }

  // eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
  async prepareLocal(): Promise<void> {}

  // eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
  async createWebpackConfig(_options?: CreateConfigOptions): Promise<void> {}

  // eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
  async createBabelConfig(_options?: CreateConfigOptions): Promise<void> {}

  async spawn(
    _pkg: string | null,
    _bin: string,
    _args?: string[],
    _options?: any
    // eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
  ): Promise<any> {}
}

// eslint-disable-next-line no-new-func
const isNode = new Function(
  'try{return this===global}catch(e){return false}'
)();

if (isNode) {
  // @ts-ignore
  // eslint-disable-next-line no-class-assign,no-eval
  PlatformApi = eval("require('./platformApi')").default;
}

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

export { PlatformApi, createBabelConfig, createWebpackConfig };
export * from '@reactant/types';
