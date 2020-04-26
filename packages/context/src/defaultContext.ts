import { Context, LoadedPlugins, Pkg } from '@reactant/types';

const context: Context = {
  action: '',
  debug: false,
  envs: {},
  includePaths: [],
  logLevel: 'info',
  masterPid: 0,
  pkg: (null as unknown) as Pkg,
  platform: null,
  platformName: '',
  platformNames: [],
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
    reactant: 'node_modules/.tmp/reactant',
    root: '.',
    tmp: '{reactant}/{_masterPid}'
  }
};

export default context;
