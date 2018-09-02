import _ from 'lodash';

const registeredConfig = {};

function getConfig() {
  return registeredConfig;
}

export function registerConfig(config) {
  _.map(config, (value, key) => {
    registeredConfig[key] = value;
  });
}

export default getConfig();
