import {
  PlatformApi,
  createBabelConfig,
  createWebpackConfig,
  getOptions as libGetOptions
} from '../lib';

export function getOptions() {
  try {
    const options = libGetOptions();
    if (options) return options;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    // eslint-disable-next-line global-require
    const options = require('@reactant/_platform');
    if (options) return options;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  const g = window || global || {};
  if (g.__REACTANT__ || g.__REACTANT__?.platformOptions) {
    return g.__REACTANT__.platformOptions;
  }
  return null;
}

export { PlatformApi, createBabelConfig, createWebpackConfig };
