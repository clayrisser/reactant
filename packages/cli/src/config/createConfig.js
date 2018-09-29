import _ from 'lodash';
import detectPort from 'detect-port';
import mergeConfiguration from 'merge-configuration';
import path from 'path';
import pkgDir from 'pkg-dir';
import rcConfig from 'rc-config';
import { environment } from 'js-info';
import { sleep } from 'deasync';
import defaultConfig from './defaultConfig';
import pkg from '../../package.json';

const occupiedPorts = [];
const rootPath = pkgDir.sync(process.cwd());

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
    publish: _.reduce(
      config.publish,
      (publish, item, key) => {
        publish[key] = _.isArray(item) ? item : [item];
        return publish;
      },
      {}
    ),
    port,
    ports: await _.reduce(
      config.ports,
      async (ports, item, key) => {
        ports[key] = item || (await getPort(port + _.keys(ports).length));
        return ports;
      },
      {}
    ),
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
    paths: _.reduce(
      config.paths,
      (paths, path, key) => {
        if (!_.includes(_.keys(paths), key)) {
          paths[key] = resolvePath(path, key, config.paths);
        }
        return paths;
      },
      {
        ...(options.platform
          ? {
              platform: path.resolve(rootPath, options.platform),
              dist: path.resolve(rootPath, config.paths.dist, options.platform)
            }
          : {})
      }
    )
  };
}

function resolvePath(configPath, configKey, paths) {
  let firstSlug = '';
  const matches = configPath.match(/^[^/]+/);
  if (matches && matches.length) [firstSlug] = matches;
  if (_.includes(_.keys(paths), firstSlug)) {
    return path.resolve(
      rootPath,
      resolvePath(paths[firstSlug]),
      configPath.substr(firstSlug.length + 1)
    );
  }
  return path.resolve(rootPath, configPath);
}

async function getPort(port = 6001) {
  let newPort = await detectPort(port);
  if (_.includes(occupiedPorts, newPort)) return getPort(++newPort);
  occupiedPorts.push(newPort);
  return newPort;
}
