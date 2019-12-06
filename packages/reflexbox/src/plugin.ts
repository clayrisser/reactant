import { Plugin } from '@reactant/plugin';
import createConfig from './createConfig';
import defaultOptions from './defaultOptions';

const plugin: Plugin = {
  config: createConfig,
  defaultOptions,
  name: 'reflexbox',
  supportedPlatforms: ['android', 'expo', 'ios', 'web']
};

export default plugin;
