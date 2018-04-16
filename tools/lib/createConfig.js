import _ from 'lodash';
import path from 'path';
import defaultConfig from './config';

const pkg = require(path.resolve('package.json'));

export default function createConfig(userConfig) {
  const config = { ...defaultConfig, ...userConfig };
  return {
    ...config,
    babelOptions: {
      ...pkg.babel,
      presets: [...pkg.babel.presets, 'react', 'react-native'],
      plugins: ['react-native-web']
    },
    envs: {
      ...config.envs,
      HOST: config.host,
      PORT: config.port
    },
    eslintOptions: {},
    paths: _.zipObject(
      _.keys(config.paths),
      _.map(config.paths, configPath => path.resolve(configPath))
    )
  };
}
