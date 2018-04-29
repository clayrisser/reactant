import _ from 'lodash';
import path from 'path';
import rcConfig from 'rc-config';
import { getEnv, setEnvironment } from 'cross-environment';
import defaultConfig from './config';

const pkg = require(path.resolve('package.json'));

export default function createConfig({
  defaultEnv = 'development',
  options = {}
}) {
  setEnvironment({
    defaults: {
      env: defaultEnv
    }
  });
  const environment = getEnv();
  const userConfig = rcConfig({ name: 'reaction' });
  const eslint = rcConfig({ name: 'eslint' });
  const config = _.merge(defaultConfig, userConfig);
  return {
    ...config,
    publish: {
      android: _.isArray(config.publish.android)
        ? config.publish.android
        : [config.publish.android],
      web: _.isArray(config.publish.web)
        ? config.publish.web
        : config.publish.web,
      ios: _.isArray(config.publish.ios)
        ? config.publish.ios
        : [config.publish.ios]
    },
    devPort: config.port + 1,
    envs: {
      ...config.envs,
      NODE_ENV: environment,
      __DEV__: environment !== 'production',
      HOST: config.host,
      PORT: config.port
    },
    environment,
    babel: _.merge(pkg.babel, config.babel),
    eslint: _.merge(eslint, pkg.eslint, config.eslint),
    options,
    paths: _.zipObject(
      _.keys(config.paths),
      _.map(config.paths, configPath => path.resolve(configPath))
    )
  };
}
