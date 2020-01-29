import execa, { ExecaReturnValue, Options as ExecaOptions } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import which from 'which';
import {
  Context,
  Logger,
  TPlatformApi,
  CreateConfigOptions
} from '@reactant/types';

export default class PlatformApi implements TPlatformApi {
  constructor(public context: Context, public logger: Logger) {}

  async prepareLocal() {
    // noop
  }

  async spawn(
    pkg: string | null,
    bin: string,
    args: string[] = [],
    options?: ExecaOptions
  ): Promise<ExecaReturnValue<string>> {
    options = {
      stdio: 'inherit',
      env: process.env,
      ...(options || {})
    };
    let command = bin;
    if (pkg) {
      const pkgPath = await pkgDir(
        // eslint-disable-next-line import/no-dynamic-require,global-require
        require.resolve(pkg, {
          paths: [
            path.resolve(
              (await pkgDir(__dirname)) || __dirname,
              'node_modules'
            ),
            path.resolve(this.context.paths.root, 'node_modules')
          ]
        })
      );
      if (!pkgPath) throw new Error(`package '${pkg}' not found`);
      command = path.resolve(
        pkgPath,
        // eslint-disable-next-line import/no-dynamic-require,global-require
        require(path.resolve(pkgPath, 'package.json')).bin[bin]
      );
    } else if (process.platform !== 'win32') {
      command = await which(command);
    }
    return execa(command, args, options);
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
