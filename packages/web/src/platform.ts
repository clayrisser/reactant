import { Platform } from '@reactant/platform';
import actions from './actions';
import createConfig from './createConfig';
import defaultOptions from './defaultOptions';

const platform: Platform = {
  actions,
  config: createConfig,
  defaultOptions,
  name: 'web'
};

export default platform;
