import { Context, PluginOptions } from '@reactant/types';

// eslint-disable-next-line no-new-func
const isNode = new Function(
  'try{return this===global}catch(e){return false}'
)();

function getOptions(): PluginOptions {
  if (isNode) {
    // eslint-disable-next-line no-eval
    const { getContext } = eval("require('@reactant/context')");
    return (getContext() as Context).platform?.options || {};
  }
  try {
    // eslint-disable-next-line global-require
    const options: PluginOptions = require('../../../../.tmp/reactant/plugins');
    if (options) return options;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  return {};
}

export const options = getOptions();

export * from '@reactant/types';
