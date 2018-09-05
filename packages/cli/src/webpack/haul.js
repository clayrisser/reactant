import _ from 'lodash';
import path from 'path';
import createWebpackConfig from './createWebpackConfig';
import { createConfigSync } from '../createConfig';

module.exports = ({ platform }, defaults) => {
  const config = createConfigSync({ options: { platform } });
  const { paths, webpack } = config;
  let webpackConfig = {
    ...defaults,
    entry: path.join(paths.root, `${platform}/index.js`)
  };
  webpackConfig = {
    ...webpackConfig,
    ...createWebpackConfig(config, webpackConfig)
  };
  if (_.isFunction(webpack)) {
    return webpack(config, webpackConfig);
  }
  return _.merge(webpackConfig, webpack);
};
