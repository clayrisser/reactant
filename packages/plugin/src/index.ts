import { Context, PluginOptions, PluginsOptions } from '@reactant/types';

// eslint-disable-next-line no-new-func
const isNode = new Function(
  'try{return this===global}catch(e){return false}'
)();

export function getOptions(pluginName: string): PluginOptions {
  if (isNode) {
    // eslint-disable-next-line no-eval
    const getContext = eval("require('@reactant/context')").default;
    return (getContext() as Context).platform?.options || {};
  }
  try {
    // eslint-disable-next-line global-require
    const options: PluginOptions = require('../../../../.tmp/reactant/plugins.json');
    if (options) return options[pluginName] || {};
    // eslint-disable-next-line no-empty
  } catch (err) {}
  if (window.__REACTANT__?.pluginsOptions) {
    return window.__REACTANT__.pluginsOptions[pluginName] || null;
  }
  return (null as unknown) as PluginsOptions;
}

export * from '@reactant/types';
