import Link from './Link';
import log from './log';

function getConfig() {
  let config = require('./config').default;
  try {
    config = require('@reactant/base/config');
    if (config.__esModule) config = config.default;
  } catch (err) {}
  return config;
}

function getAssets() {
  let assets = require('./assets').default;
  try {
    assets = require('@reactant/base/assets');
    if (assets.__esModule) assets = assets.default;
  } catch (err) {}
  return assets;
}

const config = getConfig();
const assets = getAssets();

export { Link, assets, config, log };
export default {
  Link,
  assets,
  config,
  log
};
