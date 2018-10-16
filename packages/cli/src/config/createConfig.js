import _ from 'lodash';
import mergeConfiguration from 'merge-configuration';
import rcConfig from 'rc-config';
import { environment } from 'js-info';
import { sleep } from 'deasync';
import ConfigPaths from './paths';
import ConfigPorts from './ports';
import defaultConfig from './defaultConfig';
import pkg from '../../package.json';

export default function createConfig(...args) {
  let config = null;
  createConfigAsync(...args).then(loadedConfig => {
    config = loadedConfig;
  });
  while (!config) sleep(100);
  return config;
}

async function createConfigAsync({
  defaultEnv = 'development',
  action = 'build',
  options = {},
  platformConfig = {}
}) {
  const optionsConfig = options.config ? JSON.parse(options.config) : {};
  environment.default = defaultEnv;
  const userConfig = rcConfig({ name: 'reactant' });
  const eslint = rcConfig({ name: 'eslint' });
  const config = {
    ...mergeConfiguration(
      mergeConfiguration(defaultConfig, platformConfig),
      userConfig
    ),
    platform: options.platform || '',
    ignore: {
      errors: [
        ...(defaultConfig.ignore ? defaultConfig.ignore.errors : []),
        ...(platformConfig.ignore ? platformConfig.ignore.errors : []),
        ...(userConfig.ignore ? userConfig.ignore.errors : []),
        ...(optionsConfig.ignore ? optionsConfig.ignore.errors : [])
      ],
      warnings: [
        ...(defaultConfig.ignore ? defaultConfig.ignore.warnings : []),
        ...(platformConfig.ignore ? platformConfig.ignore.warnings : []),
        ...(userConfig.ignore ? userConfig.ignore.warnings : []),
        ...(optionsConfig.ignore ? optionsConfig.ignore.warnings : [])
      ]
    }
  };
  const configPaths = new ConfigPaths(config);
  const configPorts = new ConfigPorts(config);
  return {
    ...config,
    action: action || config.action,
    moduleName: config.moduleName
      ? config.moduleName
      : _.camelCase(config.title).replace(/_/g, '-'),
    publish: _.reduce(
      config.publish,
      (publish, item, key) => {
        publish[key] = _.isArray(item) ? item : [item];
        return publish;
      },
      {}
    ),
    port: configPorts.basePort,
    ports: configPorts.ports,
    envs: {
      ...config.envs,
      NODE_ENV: environment.value,
      __DEV__: !environment.production,
      HOST: config.host,
      PORT: config.port
    },
    env: environment.value,
    babel: mergeConfiguration(pkg.babel, config.babel),
    eslint: mergeConfiguration(
      mergeConfiguration(eslint, pkg.eslint),
      config.eslint
    ),
    options: _.reduce(
      options,
      (options, option, key) => {
        if (
          key.length &&
          key[0] !== '_' &&
          key !== 'Command' &&
          key !== 'Option' &&
          key !== 'args' &&
          key !== 'commands' &&
          key !== 'options' &&
          key !== 'rawArgs'
        ) {
          options[key] = option;
        }
        return options;
      },
      {}
    ),
    paths: configPaths.paths
  };
}
