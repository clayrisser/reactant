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

function getReactant() {
  let Reactant = null;
  try {
    Reactant = require('./Reactant');
    if (Reactant.__esModule) Reactant = Reactant.default;
    return require('./Reactant').default;
  } catch (err) {}
  return Reactant;
}

const config = getConfig();
const assets = getAssets();
const Reactant = getReactant();

export { Link, assets, config, log, Reactant };
export default {
  Link,
  assets,
  config,
  log,
  Reactant
};
