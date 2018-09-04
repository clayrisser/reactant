import _ from 'lodash';

export default function createWebpackConfig(config, target) {
  const { webpack, options } = config;
  let webpackConfig = {};
  switch (options.platform) {
    case 'ios':
      webpackConfig = {
        ...webpackConfig,
        ...require('./createIosConfig').default(config, webpackConfig)
      };
      break;
    case 'android':
      webpackConfig = {
        ...webpackConfig,
        ...require('./createAndroidConfig').default(config, webpackConfig)
      };
      break;
    case 'web':
      webpackConfig = {
        ...webpackConfig,
        ...require('./createWebConfig').default(config, webpackConfig, target)
      };
      break;
  }
  if (_.isFunction(webpack)) {
    return webpack(config, webpackConfig);
  }
  return _.merge(webpackConfig, webpack);
}
