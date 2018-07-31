import CircularJSON from 'circular-json';
import _ from 'lodash';
import detectPort from 'detect-port';
import fs from 'fs-extra';
import path from 'path';
import rcConfig from 'rc-config';
import { environment } from 'js-info';
import defaultConfig from './config';

const pkg = require(path.resolve('package.json'));
const occupiedPorts = [];

export default async function createConfig({
  defaultEnv = 'development',
  action = 'build',
  options = {}
}) {
  environment.default = defaultEnv;
  const userConfig = rcConfig({ name: 'reaction' });
  const eslint = rcConfig({ name: 'eslint' });
  const config = _.merge(defaultConfig, userConfig);
  const port = await getPort(config.port);
  return {
    ...config,
    action,
    moduleName: config.moduleName
      ? config.moduleName
      : _.snakeCase(config.title).replace(/_/g, '-'),
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
      analyzer: await getPort(port + 2),
      dev: await getPort(port + 3),
      native: await getPort(8081),
      storybook: await getPort(port + 1),
      storybookNative: await getPort(7007)
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

export function sanitizeConfig(config) {
  config = {
    ...config,
    options: {
      debug: config.options.debug,
      platform: config.options.platform,
      storybook: config.options.storybook,
      verbose: config.options.verbose
    }
  };
  delete config.babel;
  delete config.eslint;
  delete config.publish;
  return config;
}

export async function saveConfig(platform, config) {
  config = sanitizeConfig(config);
  const configPath = path.resolve(config.paths[platform], 'config.json');
  await fs.writeFile(configPath, CircularJSON.stringify(config));
  return `config saved to ${configPath}`;
}
