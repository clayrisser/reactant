import { Context, LoadedPlugins } from '@reactant/types';

const context: Context = {
  action: '',
  debug: false,
  platformName: '',
  plugins: {} as LoadedPlugins,
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
