import fs from 'fs-extra';
import ncp from 'ncp-promise';
import path from 'path';
import { Config, getConfig, updateConfig } from '@reactant/config';

export default class PlatformApi {
  config: Config;

  async getConfig(): Promise<Config> {
    return getConfig();
  }

  async updateConfig(config: Config): Promise<Config> {
    return updateConfig(config);
  }

  async templateCracoConfig(config?: Config) {
    if (!config) config = await this.getConfig();
    const { paths } = config;
    await fs.copy(
      path.resolve(__dirname, 'templates/craco.config.js'),
      path.resolve(paths.build, 'craco.config.js')
    );
  }

  async templateWebpackConfig(config?: Config) {
    if (!config) config = await this.getConfig();
    await this.templateCracoConfig(config);
    const { paths } = config;
    await fs.copy(
      path.resolve(__dirname, 'templates/webpack.config.js'),
      path.resolve(paths.build, 'webpack.config.js')
    );
  }

  async prepareBuild(config?: Config) {
    if (!config) config = await this.getConfig();
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
