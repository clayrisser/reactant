import CircularJSON from 'circular-json';
import fs from 'fs';
import path from 'path';
import { log } from '@reactant/base';
import createConfig from './createConfig';

let globalConfig = null;

function loadConfig(...args) {
  if (!globalConfig) {
    globalConfig = createConfig(...args);
    log.debug('config', globalConfig);
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

export { loadConfig, saveConfig, sanitizeConfig };
export default {
  loadConfig,
  saveConfig,
  sanitizeConfig
};
