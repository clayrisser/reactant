import { Plugin } from '@reactant/plugin';
import actions from './actions';
import createConfig from './createConfig';
import defaultOptions from './defaultOptions';

const plugin: Plugin = {
  actions,
  config: createConfig,
  defaultOptions,
  name: 'storybook',
  supportedPlatforms: ['expo', 'web']
};

export default plugin;
