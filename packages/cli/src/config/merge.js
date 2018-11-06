import mergeConfiguration from 'merge-configuration';

export default function merge(config, modifier) {
  const newConfig = mergeConfiguration(config, modifier);
  if (typeof modifier === 'function') modifier = modifier(config);
  const webpack =
    mergeConfiguration(config.webpack || {}, modifier.webpack, {}, config) ||
    {};
  newConfig.webpack = webpack;
  return newConfig;
}
