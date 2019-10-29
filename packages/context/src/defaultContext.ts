import path from 'path';
import pkgDir from 'pkg-dir';
import { Context, Plugins } from '@reactant/types';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

const context: Context = {
  options: {},
  paths: {
    build: path.resolve(rootPath, '.tmp/reactant/build'),
    root: rootPath,
    tmp: path.resolve(rootPath, '.tmp/reactant')
  },
  platformName: '',
  plugins: {} as Plugins,
  state: {},
  userConfig: {}
};

export default context;
