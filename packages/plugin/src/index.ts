import { Context, PluginOptions, PluginsOptions } from '@reactant/types';

// eslint-disable-next-line no-new-func
const isNode = new Function(
  'try{return this===global}catch(e){return false}'
)();

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
