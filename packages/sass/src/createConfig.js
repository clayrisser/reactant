import createWebpackConfig from './createWebpackConfig';

export default function(config) {
  return {
    ...config,
    sass: {
      ...(config.sass || {})
    },
    storybook: createWebpackConfig(config.storybook || {}, config || {}),
    webpack: createWebpackConfig(config.webpack || {}, config || {})
  };
}
