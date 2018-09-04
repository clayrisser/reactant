import createHaulConfig from './createHaulConfig';

export default function createAndroidConfig(config, webpackConfig) {
  webpackConfig = {
    ...webpackConfig,
    ...createHaulConfig(config, webpackConfig)
  };
  return webpackConfig;
}
