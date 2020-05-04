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
  const g = window || global || {};
  if (g.__REACTANT__?.pluginsOptions) {
    return g.__REACTANT__.pluginsOptions[pluginName] || {};
  }
  return (null as unknown) as PluginsOptions;
}

export * from '@reactant/types';
