import _ from 'lodash';
import detectPort from 'detect-port';
import path from 'path';
import pkgDir from 'pkg-dir';
import rcConfig from 'rc-config';
import { environment } from 'js-info';
import { sleep } from 'deasync';
import defaultConfig from './defaultConfig';
import pkg from '../../package.json';

const occupiedPorts = [];

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
  let config = {};
  if (_.isFunction(platformConfig)) {
    config = platformConfig(defaultConfig);
  } else {
    config = _.merge({}, defaultConfig, platformConfig);
  }
  if (_.isFunction(userConfig)) {
    config = userConfig(config);
  } else {
    config = _.merge({}, config, userConfig);
  }
  config = {
    ...config,
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
  const port = await getPort(config.port);
  return {
    ...config,
    platform: options.platform,
    action: action || config.action,
    moduleName: config.moduleName
      ? config.moduleName
      : _.camelCase(config.title).replace(/_/g, '-'),
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
    port,
    ports: {
      analyzer: _.get(config, 'ports.analyzer') || (await getPort(port + 2)),
      dev: _.get(config, 'ports.dev') || (await getPort(port + 3)),
      native: _.get(config, 'ports.native') || 8081,
      storybook: _.get(config, 'ports.storybook') || (await getPort(port + 1)),
      storybookNative:
        _.get(config, 'ports.storybookNative') || (await getPort(port + 4))
    },
    envs: {
      ...config.envs,
      NODE_ENV: environment.value,
      __DEV__: !environment.production,
      HOST: config.host,
      PORT: config.port
    },
    env: environment.value,
    babel: _.merge(pkg.babel, config.babel),
    eslint: _.merge(eslint, pkg.eslint, config.eslint),
    options,
    paths: _.zipObject(
      _.keys(config.paths),
      _.map(config.paths, (configPath, configKey) => {
        return resolvePath(configPath, configKey, config.paths);
      })
    )
  };
}

function resolvePath(configPath, configKey, paths) {
  let firstSlug = '';
  const matches = configPath.match(/^[^/]+/);
  if (matches && matches.length) [firstSlug] = matches;
  if (_.includes(_.keys(paths), firstSlug)) {
    return path.resolve(
      pkgDir.sync(process.cwd()),
      resolvePath(paths[firstSlug]),
      configPath.substr(firstSlug.length + 1)
    );
  }
  return path.resolve(configPath);
}

async function getPort(port = 6001) {
  let newPort = await detectPort(port);
  if (_.includes(occupiedPorts, newPort)) return getPort(++newPort);
  occupiedPorts.push(newPort);
  return newPort;
}
