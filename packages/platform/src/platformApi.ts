import crossSpawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import which from 'which';
import { SpawnOptions, ChildProcess } from 'child_process';
import { processes } from '@reactant/context';
import {
  Context,
  Logger,
  TPlatformApi,
  CreateConfigOptions
} from '@reactant/types';
import { getLinked } from 'linked-deps';

async function recursiveNodeModulesSymlink(
  sourcePath: string,
  targetPath: string
): Promise<void> {
  if (!(await fs.pathExists(path.resolve(sourcePath, 'node_modules')))) return;
  await fs.mkdirs(path.resolve(targetPath, 'node_modules'));
  await Promise.all(
    (await fs.readdir(path.resolve(sourcePath, 'node_modules'))).map(
      async (item: string) => {
        const fullSourcePath = path.resolve(sourcePath, 'node_modules', item);
        const fullTargetPath = path.resolve(targetPath, 'node_modules', item);
        if (item[0] === '@') {
          await fs.mkdirs(fullTargetPath);
          await Promise.all(
            (await fs.readdir(fullSourcePath)).map(async (item: string) => {
              if (!(await fs.pathExists(path.resolve(fullTargetPath, item)))) {
                await fs.symlink(
                  path.resolve(fullSourcePath, item),
                  path.resolve(fullTargetPath, item)
                );
              }
              await recursiveNodeModulesSymlink(
                path.resolve(fullSourcePath, item),
                targetPath
              );
            })
          );
        } else if (!(await fs.pathExists(fullTargetPath))) {
          await fs.symlink(fullSourcePath, fullTargetPath);
          await recursiveNodeModulesSymlink(fullSourcePath, targetPath);
        }
      }
    )
  ).catch((err: { code: string }) => {
    if (err.code !== 'EEXIST') throw err;
  });
}

export default class PlatformApi implements TPlatformApi {
  constructor(public context: Context, public logger: Logger) {}

  async prepareLocal() {
    const lerna = new Set(getLinked()).has('@reactant/cli');
    if (lerna) {
      await recursiveNodeModulesSymlink(
        this.context.paths.root,
        this.context.paths.root
      );
    }
  }

  async spawn(
    pkg: string | null,
    bin: string,
    args: string[] = [],
    options?: SpawnOptions
  ): Promise<string | ChildProcess> {
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
    return new Promise((resolve, reject) => {
      const ps = crossSpawn(command, args, options);
      processes[ps.pid] = ps;
      let result: string | ChildProcess = ps;
      if (ps.stdout && ps.stderr) {
        result = '';
        ps.stdout.on('data', data => (result += data.toString()));
        ps.stderr.on('data', data => (result += data.toString()));
      }
      ps.on('close', () => resolve(result));
      ps.on('error', (err: Error) => reject(err));
    });
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
