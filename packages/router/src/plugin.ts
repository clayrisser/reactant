import { Plugin } from '@reactant/plugin';
import createConfig from './createConfig';
import defaultOptions from './defaultOptions';

export default {
  config: createConfig,
  defaultOptions,
  name: 'router',
  supportedPlatforms: ['web']
} as Plugin;
