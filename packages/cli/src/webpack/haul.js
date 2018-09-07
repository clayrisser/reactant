import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import createWebpackConfig from './createWebpackConfig';
import { loadConfig } from '../config';

module.exports = ({ platform }, defaults) => {
  const options = {
    platform,
    debug: _.includes(process.argv, '--debug') || _.includes(process.argv, '-d')
  };
  const config = loadConfig({ options });
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
    webpackConfig = webpack(config, webpackConfig);
  } else {
    webpackConfig = _.merge(webpackConfig, webpack);
  }
  if (options.debug) {
    fs.writeFileSync(path.resolve(paths.debug, platform, 'webpackConfig.json'));
  }
  return webpackConfig;
};
