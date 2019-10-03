import { Platform } from '@reactant/platform';
import actions from './actions';
import createConfig from './createConfig';
import defaultOptions from './defaultOptions';

export default {
  actions,
  config: createConfig,
  defaultOptions,
  name: 'web'
} as Platform;
