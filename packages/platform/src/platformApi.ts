import Err from 'err';
import asyncCrossSpawn from 'async-cross-spawn';
import fs from 'fs-extra';
import ncp from 'ncp-promise';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Config, getConfig, updateConfig } from '@reactant/config';
import { SpawnOptions } from 'child_process';

export default class PlatformApi {
  config: Config;

  getConfig(): Config {
    return getConfig();
  }

  updateConfig(config: Config): Config {
    return updateConfig(config);
  }

  async spawn(
    pkg: string,
    bin: string,
    args: string[] = [],
    options?: SpawnOptions
  ) {
    options = {
      stdio: 'inherit',
      ...options
    };
    const pkgPath = await pkgDir(require.resolve(pkg));
    if (!pkgPath) throw new Err(`package '${pkg}' not found`);
    const command = path.resolve(
      pkgPath,
      require(`${pkg}/package.json`).bin[bin]
    );
    return asyncCrossSpawn(command, args, options);
  }

  async templateCracoConfig(config?: Config) {
    if (!config) config = this.getConfig();
    const { paths } = config;
    await fs.copy(
      path.resolve(__dirname, 'templates/craco.config.js'),
      path.resolve(paths.build, 'craco.config.js')
    );
  }

  async templateWebpackConfig(config?: Config) {
    if (!config) config = this.getConfig();
    await this.templateCracoConfig(config);
    const { paths } = config;
    await fs.copy(
      path.resolve(__dirname, 'templates/webpack.config.js'),
      path.resolve(paths.build, 'webpack.config.js')
    );
  }

  async prepare(config?: Config) {
    if (!config) config = this.getConfig();
    const { paths, rootPath } = config;
    await ncp(rootPath, path.resolve(rootPath, paths.build), {
      filter: pathName => {
        return !(
          pathName.indexOf(path.resolve(rootPath, paths.tmp)) > -1 ||
          pathName.indexOf(path.resolve(rootPath, paths.dist)) > -1 ||
          pathName.indexOf(path.resolve(rootPath, paths.build)) > -1 ||
          pathName.indexOf('/node_modules/') > -1 ||
          /\/node_modules$/.test(pathName)
        );
      }
    });
  }
}
