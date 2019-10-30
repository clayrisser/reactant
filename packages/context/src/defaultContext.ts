import { Context, Plugins } from '@reactant/types';

const context: Context = {
  action: '',
  debug: false,
  platformName: '',
  plugins: {} as Plugins,
  state: {},
  userConfig: {},
  options: {
    config: {},
    debug: false
  },
  paths: {
    build: '{tmp}/build',
    dist: 'dist/{_platform}',
    root: '.',
    tmp: '.tmp/reactant/{_platform}/{_action}'
  }
};

export default context;
