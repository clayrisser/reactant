import { Context, Plugins } from '@reactant/types';

const context: Context = {
  action: '',
  options: {},
  platformName: '',
  plugins: {} as Plugins,
  state: {},
  userConfig: {},
  paths: {
    build: '{tmp}/build',
    dist: 'dist/{_platform}',
    root: '.',
    tmp: '.tmp/reactant/{_platform}/{_action}'
  }
};

export default context;
