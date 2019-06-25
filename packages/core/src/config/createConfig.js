import _ from 'lodash';
import cosmiconfig from 'cosmiconfig';
import mergeConfiguration from 'merge-configuration';
import path from 'path';
import pkgDir from 'pkg-dir';
import { environment } from 'js-info';
import ConfigPaths from './paths';
import ConfigPorts from './ports';
import defaultConfig from './defaultConfig';
import { loadReactantPlatform } from '../platform';

export default function createConfig(action, options = {}) {
  const pkg = path.resolve(pkgDir.sync(process.cwd()), 'package.json');
  options = sanitizeOptions(options);
  const userConfig =
    cosmiconfig('reactant').searchSync(pkgDir.sync(process.cwd()))?.config ||
    {};
  let config = mergeConfiguration(defaultConfig, userConfig);
  if (options.platform && typeof options.platform !== 'boolean') {
    config.platform = loadReactantPlatform(config.platform);
  }
  config = mergeConfiguration(config, config.platform.config(config));
  const eslint = mergeConfiguration(
    cosmiconfig('eslint').searchSync(pkgDir.sync(process.cwd()))?.config || {},
    config.eslint
  );
  const babel = mergeConfiguration(
    cosmiconfig('babel').searchSync(pkgDir.sync(process.cwd()))?.config || {},
    config.babel
  );
  const configPaths = new ConfigPaths(config);
  const configPorts = new ConfigPorts(config);
  config = {
    ...config,
    action,
    babel,
    env: environment.value,
    eslint,
    options,
    paths: configPaths.paths,
    port: configPorts.basePort,
    ports: configPorts.ports,
    title: config.title || _.titleCase(pkg.name),
    moduleName:
      config.moduleName || _.camelCase(config.title).replace(/_/g, '-'),
    envs: {
      ...config.envs,
      HOST: config.host,
      NODE_ENV: environment.value,
      PORT: config.port,
      __DEV__: !environment.production
    }
  };
  return config;
}

export function rebuildConfig() {
  return createConfig();
}

function sanitizeOptions(options) {
  return _.reduce(
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
  );
}
