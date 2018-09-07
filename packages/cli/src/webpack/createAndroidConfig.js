import createHaulConfig from './createHaulConfig';

export default function createAndroidConfig(config, webpackConfig) {
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
        ...(options.storybook ? ['.storybook.android.js'] : []),
        '.android.js',
        ...webpackConfig.resolve.extensions
      ]
    }
  };
  return webpackConfig;
}
