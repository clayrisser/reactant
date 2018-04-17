import _ from 'lodash';
import path from 'path';
import defaultConfig from './config';
import { getEnv, setEnvironment } from 'cross-environment';

const pkg = require(path.resolve('package.json'));

export default function createConfig({
  userConfig = {},
  defaultEnv = 'development'
}) {
  setEnvironment({
    defaults: {
      env: defaultEnv
    }
  });
  const environment = getEnv();
  const config = { ...defaultConfig, ...userConfig };
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
    babelOptions: {
      ...pkg.babel,
      presets: [...pkg.babel.presets, 'react', 'react-native'],
      plugins: ['react-native-web']
    },
    eslintOptions: {},
    paths: _.zipObject(
      _.keys(config.paths),
      _.map(config.paths, configPath => path.resolve(configPath))
    )
  };
}
