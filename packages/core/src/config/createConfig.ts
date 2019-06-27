import _ from 'lodash';
import cosmiconfig from 'cosmiconfig';
import mergeConfiguration from 'merge-configuration';
import path from 'path';
import pkgDir from 'pkg-dir';
import { environment } from 'js-info';
import { oc } from 'ts-optchain.macro';
import ConfigPorts from './ports';
import defaultConfig from './defaultConfig';
import { Config, Option, Options } from '../types';

export default function createConfig(
  action?: string,
  options: Options = {},
  customConfig: Partial<Config> = {}
): Config {
  const rootPath = pkgDir.sync(process.cwd()) || process.cwd();
  const pkg = require(path.resolve(rootPath, 'package.json'));
  options = sanitizeOptions(options);
  const userConfig: Partial<Config> = oc(
    cosmiconfig('reactant').searchSync(rootPath)
  ).config({});
  let config = mergeConfiguration<Config>(defaultConfig, userConfig);
  if (options.platform && typeof options.platform !== 'boolean') {
    config.platform = { config: () => ({}) }; // loadReactantPlatform(config.platform);
    config = mergeConfiguration(config, config.platform.config(config));
  }
  config = mergeConfiguration(config, customConfig);
  const eslint: object = mergeConfiguration(
    oc(cosmiconfig('eslint').searchSync(rootPath)).config({}),
    config.eslint
  );
  const babel: object = mergeConfiguration(
    oc(cosmiconfig('babel').searchSync(rootPath)).config({}),
    config.babel
  );
  const configPorts = new ConfigPorts(config);
  config = {
    ...config,
    action,
    babel,
    env: environment.value,
    eslint,
    options,
    // paths: configPaths.paths,
    port: configPorts.basePort,
    ports: configPorts.ports,
    title: config.title || _.startCase(pkg.name),
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

function sanitizeOptions(options: Options): Options {
  return Object.entries(options).reduce(
    (options: Options, [key, option]: [string, Option]) => {
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
