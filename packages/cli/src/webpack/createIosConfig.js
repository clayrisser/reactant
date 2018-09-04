import createHaulConfig from './createHaulConfig';

export default function createIosConfig(config, webpackConfig) {
  webpackConfig = {
    ...webpackConfig,
    ...createHaulConfig(config, webpackConfig)
  };
  return webpackConfig;
}
