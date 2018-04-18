import _ from 'lodash';
import path from 'path';
import rcConfig from 'rc-config';
import { getEnv, setEnvironment } from 'cross-environment';
import defaultConfig from './config';

const pkg = require(path.resolve('package.json'));

export default function createConfig({ defaultEnv = 'development' }) {
  setEnvironment({
    defaults: {
      env: defaultEnv
    }
  });
  const environment = getEnv();
  const userConfig = rcConfig('reaction');
  const babel = rcConfig('babel');
  const eslint = rcConfig('eslint');
  const config = _.merge(defaultConfig, userConfig);
  return {
    ...config,
    envs: {
      ...config.envs,
      NODE_ENV: environment,
      __DEV__: environment !== 'production',
      HOST: config.host,
      PORT: config.port
    },
    environment,
    babel: _.merge(babel, pkg.babel, config.babel),
    eslint: _.merge(eslint, pkg.eslint, config.eslint),
    paths: _.zipObject(
      _.keys(config.paths),
      _.map(config.paths, configPath => path.resolve(configPath))
    )
  };
}
