import log from './log';
import ReactantApp from './ReactantApp';

let registeredConfig = false;

function getConfig() {
  const requiredConfig = require('./config');
  let config = requiredConfig.default;
  try {
    config = require('@reactant/core/config');
    if (!registeredConfig) {
      registeredConfig = true;
      const { registerConfig } = requiredConfig;
      registerConfig(config);
    }
    if (config.__esModule) config = config.default;
  } catch (err) {}
  return config;
}

function getAssets() {
  let assets = require('./assets').default;
  try {
    assets = require('@reactant/core/assets');
    if (assets.__esModule) assets = assets.default;
  } catch (err) {}
  return assets;
}

const config = getConfig();
const assets = getAssets();

export { ReactantApp, assets, config, log };
export default {
  ReactantApp,
  assets,
  config,
  log
};
