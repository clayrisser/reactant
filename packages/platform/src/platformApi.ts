import fs from 'fs-extra';
import path from 'path';
import { Config, getConfig, updateConfig } from '@reactant/config';
import Steps from './steps';

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

  steps = new Steps();
}
