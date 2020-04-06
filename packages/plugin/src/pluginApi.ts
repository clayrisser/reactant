import Helpers from '@reactant/helpers';
import fs from 'fs-extra';
import path from 'path';
import { ExecaReturnValue, Options as ExecaOptions } from 'execa';
import {
  Context,
  CreateConfigOptions,
  Logger,
  TPluginApi,
} from '@reactant/types';

export default class PluginApi implements TPluginApi {
  public helpers: Helpers;

  constructor(public context: Context, public logger: Logger) {
    this.helpers = new Helpers(context);
  }

  async prepareLocal() {
    // noop
  }

  async spawn(
    bin: string | string[],
    args: string[] = [],
    options?: ExecaOptions
  ): Promise<ExecaReturnValue<string>> {
    return this.helpers.spawn(bin, args, options);
  }

  async createWebpackConfig(options: CreateConfigOptions = {}) {
    options = {
      rootPath: false,
      ...options,
    };
    const { paths } = this.context;
    const webpackConfigPath = path.resolve(
      options.rootPath ? paths.root : paths.tmp,
      'webpack.config.js'
    );
    if (await fs.pathExists(webpackConfigPath)) {
      await fs.unlink(webpackConfigPath);
    }
    await fs.copy(
      path.resolve(__dirname, 'templates/webpack.config.js'),
      webpackConfigPath
    );
  }

  async createBabelConfig(options: CreateConfigOptions = {}) {
    options = {
      rootPath: false,
      ...options,
    };
    const { paths } = this.context;
    const babelConfigPath = path.resolve(
      options.rootPath ? paths.root : paths.tmp,
      'babel.config.js'
    );
    if (await fs.pathExists(babelConfigPath)) {
      await fs.unlink(babelConfigPath);
    }
    await fs.copy(
      path.resolve(__dirname, 'templates/babel.config.js'),
      babelConfigPath
    );
  }
}
