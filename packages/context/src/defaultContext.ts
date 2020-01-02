import { Context, LoadedPlugins } from '@reactant/types';

const context: Context = {
  action: '',
  debug: false,
  envs: {},
  logLevel: 'info',
  platformName: '',
  plugins: {} as LoadedPlugins,
  state: {},
  options: {
    args: [],
    config: {},
    debug: false
  },
  paths: {
    build: '{tmp}/build',
    dist: 'dist/{_platform}',
    reactant: '.tmp/reactant',
    root: '.',
    tmp: '{reactant}/{_platform}/{_action}'
  }
};

export default context;
