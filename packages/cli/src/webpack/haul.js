import CircularJSON from 'circular-json';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import createWebpackConfig from './createWebpackConfig';
import { rebuildConfig } from '../config';

module.exports = ({ platform }, defaults) => {
  const config = rebuildConfig({ options: { platform, debug: false } });
  const { paths, webpack, options } = config;
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
    fs.mkdirsSync(path.resolve(paths.debug, platform));
    fs.writeFileSync(
      path.resolve(paths.debug, platform, 'webpackConfig.json'),
      CircularJSON.stringify(webpackConfig, null, 2)
    );
  }
  return webpackConfig;
};
