import _ from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import createWebpackConfig from './createWebpackConfig';
import { createConfigSync } from '../createConfig';

module.exports = ({ platform }, defaults) => {
  const config = createConfigSync({ options: { platform } });
  const { paths, webpack } = config;
  const webpackConfig = {
    ...defaults,
    ...createWebpackConfig(config),
    entry: path.join(paths.root, `${platform}/index.js`)
  };
  fs.writeFileSync('__webpack.json', JSON.stringify(webpackConfig));
  if (_.isFunction(webpack)) {
    return webpack(config, webpackConfig);
  }
  return _.merge(webpackConfig, webpack);
};
