import createHaulConfig from './createHaulConfig';

export default function createIosConfig(config, webpackConfig) {
  webpackConfig = {
    ...webpackConfig,
    ...createHaulConfig(config, webpackConfig)
  };
  webpackConfig = {
    ...webpackConfig,
    resolve: {
      ...webpackConfig.resolve,
      extensions: ['.ios.js', '.native.js', '.js', '.json', '.jsx', '.mjs']
    }
  };
  return webpackConfig;
}
