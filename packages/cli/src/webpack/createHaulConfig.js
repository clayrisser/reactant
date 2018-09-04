import { createWebpackConfig } from 'haul';

export default function createHaulConfig(config, webpackConfig) {
  webpackConfig = {
    ...webpackConfig,
    ...createWebpackConfig()
  };
  return webpackConfig;
}
