import { getOptions as libGetOptions } from '../lib';

export function getOptions(pluginName) {
  try {
    const options = libGetOptions();
    if (options) return options[pluginName] || {};
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    // eslint-disable-next-line global-require
    const options = require('@reactant/_plugins');
    if (options) return options[pluginName] || {};
    // eslint-disable-next-line no-empty
  } catch (err) {}
  const g = window || global || {};
  if (g.__REACTANT__ && g.__REACTANT__.pluginsOptions) {
    return g.__REACTANT__.pluginsOptions[pluginName] || {};
  }
  return null;
}
