import ncp from 'ncp-promise';
import path from 'path';
import { Config, getConfig } from '@reactant/config';

export default class Steps {
  config: Config;

  async getConfig(): Promise<Config> {
    return getConfig();
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
