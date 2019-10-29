import pkgDir from 'pkg-dir';
import { Context, Plugins } from '@reactant/types';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

const context: Context = {
  options: {},
  paths: { root: rootPath },
  platformName: '',
  plugins: {} as Plugins,
  state: {},
  userConfig: {}
};

export default context;
