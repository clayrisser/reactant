export default function(config) {
  config.babel.presets.push(require.resolve('babel-preset-react'));
  config.babel.plugins.unshift(require.resolve('react-hot-loader/babel'));
  return config;
}
