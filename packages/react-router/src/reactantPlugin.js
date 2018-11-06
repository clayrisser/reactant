import createConfig from './createConfig';

export default {
  config: createConfig,
  dependsOn: ['@reactant/redux'],
  platforms: ['@reactant/web', '@reactant/web-isomorphic']
};
