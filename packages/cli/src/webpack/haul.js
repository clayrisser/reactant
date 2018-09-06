import _ from 'lodash';
import path from 'path';
import createWebpackConfig from './createWebpackConfig';
import { createConfigSync } from '../createConfig';

module.exports = ({ platform }, defaults) => {
  const options = {
    platform,
    debug: _.includes(process.argv, '--debug') || _.includes(process.argv, '-d')
  };
  const config = createConfigSync({ options });
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
