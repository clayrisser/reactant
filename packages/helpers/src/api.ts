import fs from 'fs-extra';
import path from 'path';
import { Context, CreateConfigOptions, Logger } from '@reactant/types';
import { ExecaReturnValue, Options as ExecaOptions } from 'execa';
import Helpers from '.';
import where from './where';

export default class Api {
  public helpers: Helpers;

  constructor(public context: Context, public logger: Logger) {
    this.helpers = new Helpers(context);
  }

  where(program: string): Promise<string | null> {
    return where(program);
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
      ...options
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
      ...options
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
