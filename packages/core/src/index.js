import log from './log';
import ReactantApp from './ReactantApp';

function getConfig() {
  let config = require('./config').default;
  try {
    config = require('@reactant/core/config');
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
