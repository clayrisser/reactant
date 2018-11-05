import CircularJSON from 'circular-json';
import fs from 'fs-extra';
import path from 'path';
import { log } from '@reactant/core';
import { registerConfig } from '@reactant/core/config';
import Socket, { socketGetConfig } from './socket';
import createConfig from './createConfig';
import { loadReactantPlatform } from '../platform';

let globalConfig = null;

function loadConfig(...args) {
  if (!globalConfig) {
    globalConfig = createConfig(...args);
    registerConfig(globalConfig);
    log.write('config', globalConfig);
  }
  return globalConfig;
}

function saveConfig(platform) {
  const config = sanitizeConfig(globalConfig);
  const configPath = path.resolve(config.paths[platform], 'config.json');
  fs.writeFileSync(configPath, CircularJSON.stringify(config));
  return `config saved to ${configPath}`;
}

function sanitizeConfig(config) {
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

function rebuildConfig({
  action = 'start',
  defaultEnv = 'development',
  options
}) {
  const socketConfig = socketGetConfig();
  if (socketConfig) {
    ({ action } = socketConfig);
    defaultEnv = socketConfig.env;
    options = {
      ...options,
      ...socketConfig.options,
      platform: options.platform
    };
  }
  const platformName = socketConfig.platforms[options.platform];
  const platform = loadReactantPlatform(socketConfig, platformName);
  return loadConfig({
    options,
    defaultEnv,
    action,
    platformConfig: platform.config || {}
  });
}

export {
  loadConfig,
  saveConfig,
  sanitizeConfig,
  Socket,
  rebuildConfig,
  createConfig
};
export default {
  loadConfig,
  saveConfig,
  sanitizeConfig,
  Socket,
  rebuildConfig,
  createConfig
};
