import createHaulConfig from './createHaulConfig';

export default function createIosConfig(config, webpackConfig) {
  const { options } = config;
  webpackConfig = {
    ...webpackConfig,
    ...createHaulConfig(config, webpackConfig)
  };
  webpackConfig = {
    ...webpackConfig,
    resolve: {
      ...webpackConfig.resolve,
      extensions: [
        ...(options.storybook ? ['.storybook.ios.js'] : []),
        '.ios.js',
        ...webpackConfig.resolve.extensions
      ]
    }
  };
  return webpackConfig;
}
