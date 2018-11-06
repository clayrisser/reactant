import Err from 'err';
import _ from 'lodash';
import mergeConfiguration from 'merge-configuration';
import rcConfig from 'rc-config';
import { environment } from 'js-info';
import { sleep } from 'deasync';
import ConfigPaths from './paths';
import ConfigPorts from './ports';
import defaultConfig from './defaultConfig';
import merge from './merge';
import pkg from '../../package.json';
import { getReactantPluginsConfig } from '../plugin';

export default function createConfig(...args) {
  let config = null;
  createConfigAsync(...args).then(loadedConfig => {
    config = loadedConfig;
  });
  while (!config) sleep(100);
  return config;
}

async function createConfigAsync({
  action = 'build',
  defaultEnv = 'development',
  options = {},
  platformConfig = {},
  platformType = '',
  plugins = []
}) {
  const optionsConfig = options.config ? JSON.parse(options.config) : {};
  environment.default = defaultEnv;
  const userConfig = rcConfig({ name: 'reactant' });
  const eslint = rcConfig({ name: 'eslint' });
  let config = merge(defaultConfig, platformConfig);
  const pluginsConfig = getReactantPluginsConfig(config, plugins);
  config = {
    ...merge(merge(merge(config, pluginsConfig), userConfig), optionsConfig),
    platform: options.platform || '',
    platformType
  };
  config = mergePlatformConfig(config);
  config = mergePluginsConfig(config);
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

function mergePlatformConfig(config) {
  const platform = config.platforms[config.platform];
  if (_.isArray(platform) && config.platform.length > 1) {
    const [, platformConfig] = platform;
    if (platformConfig.platform) {
      throw new Err("platform config cannot set 'platform'", 400);
    }
    config = merge(config, platformConfig);
  }
  config.platforms = _.reduce(
    config.platforms,
    (platforms, platorm, key) => {
      if (_.isArray(platorm)) {
        [platorm] = platorm;
      }
      platforms[key] = platorm;
      return platforms;
    },
    {}
  );
  return config;
}

function mergePluginsConfig(config) {
  _.each(config.plugins, plugin => {
    if (_.isArray(plugin)) {
      const [pluginName] = plugin;
      config.plugin = pluginName;
      if (plugin.length > 1) {
        const [, pluginConfig] = plugin;
        if (pluginConfig.plugins) {
          throw new Err("plugin config cannot set 'plugins'", 400);
        }
        config = merge(config, pluginConfig);
      }
    }
  });
  return config;
}
