import createWebpackConfig from './createWebpackConfig';

export default function(config) {
  return {
    ...config,
    sass: {
      ...(config.sass || {})
    },
    webpack: createWebpackConfig
  };
}
