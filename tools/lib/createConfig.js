import _ from 'lodash';
import defaultConfig from './config';
import fs from 'fs-extra';
import path from 'path';
import { getEnv, setEnvironment } from 'cross-environment';

const pkg = require(path.resolve('package.json'));

export default function createConfig({ defaultEnv = 'development' }) {
  setEnvironment({
    defaults: {
      env: defaultEnv
    }
  });
  const environment = getEnv();
  const userConfig = safeReadJsonSync(path.resolve('.reactionrc'));
  const babel = safeReadJsonSync(path.resolve('.babelrc'));
  const eslint = safeReadJsonSync(path.resolve('.eslintrc'));
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

function safeReadJsonSync(path) {
  if (!fs.existsSync(path)) return {};
  return fs.readJsonSync(path);
}
