import createHaulConfig from './createHaulConfig';

export default function createAndroidConfig(config, webpackConfig) {
  webpackConfig = {
    ...webpackConfig,
    ...createHaulConfig(config, webpackConfig)
  };
  webpackConfig = {
    ...webpackConfig,
    resolve: {
      ...webpackConfig.resolve,
      extensions: ['.android.js', '.native.js', '.js', '.json', '.jsx', '.mjs']
    }
  };
  return webpackConfig;
}
