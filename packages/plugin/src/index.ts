import {
  Context,
  Logger,
  PluginOptions,
  PluginsOptions,
  TPluginApi
} from '@reactant/types';

class PluginApi implements TPluginApi {
  constructor(public context: Context, public logger: Logger) {
    throw new Error('only node can use plugin api');
  }

  // eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
  async prepareLocal(): Promise<void> {}

  async spawn(
    _bin: string | string[],
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
  PluginApi = eval("require('./pluginApi')").default;
}

export function getOptions(pluginName: string): PluginOptions {
  if (isNode) {
    // eslint-disable-next-line no-eval
    const getContext = eval("require('@reactant/context')").default;
    return (getContext() as Context).plugins?.[pluginName]?.options || {};
  }
  // try {
  //   // eslint-disable-next-line global-require
  //   const options: PluginOptions = require('@reactant/_plugins');
  //   if (options) return options[pluginName] || {};
  //   // eslint-disable-next-line no-empty
  // } catch (err) {}
  // try {
  //   // eslint-disable-next-line global-require
  //   const options: PluginOptions = require('../../../.tmp/reactant/plugins.json');
  //   if (options) return options[pluginName] || {};
  //   // eslint-disable-next-line no-empty
  // } catch (err) {}
  const g = window || global || {};
  if (g.__REACTANT__?.pluginsOptions) {
    return g.__REACTANT__.pluginsOptions[pluginName] || {};
  }
  return (null as unknown) as PluginsOptions;
}

export * from '@reactant/types';
export { PluginApi };
