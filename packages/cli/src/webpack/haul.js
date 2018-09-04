import _ from 'lodash';
import createWebpackConfig from './createWebpackConfig';
import { createConfigSync } from '../createConfig';

export default {
  webpack: ({ platform }) => {
    const config = createConfigSync({ options: { platform } });
    const { webpack } = config;
    const webpackConfig = createWebpackConfig(config);
    if (_.isFunction(webpack)) {
      return webpack(config, webpackConfig);
    }
    return _.merge(webpackConfig, webpack);
  }
};
