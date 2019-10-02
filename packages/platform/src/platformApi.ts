import Err from 'err';
import asyncCrossSpawn from 'async-cross-spawn';
import fs from 'fs-extra';
import ncp from 'ncp-promise';
import path from 'path';
import pkgDir from 'pkg-dir';
import { SpawnOptions } from 'child_process';
import { getLinked } from 'linked-deps';
import {
  Config,
  PlatformApi as IPlatformApi,
  getConfig,
  updateConfig
} from '@reactant/core';

async function recursiveNodeModulesSymlink(
  sourcePath: string,
  targetPath: string
): Promise<void> {
  if (!(await fs.pathExists(path.resolve(sourcePath, 'node_modules')))) return;
  await fs.mkdirs(path.resolve(targetPath, 'node_modules'));
  await Promise.all(
    (await fs.readdir(path.resolve(sourcePath, 'node_modules'))).map(
      async (itemPath: string) => {
        const fullSourcePath = path.resolve(
          sourcePath,
          'node_modules',
          itemPath
        );
        const fullTargetPath = path.resolve(
          targetPath,
          'node_modules',
          itemPath
        );
        if (itemPath[0] === '@') {
          await fs.mkdirs(fullTargetPath);
          await Promise.all(
            (await fs.readdir(fullSourcePath)).map(async (item: string) => {
              if (!(await fs.pathExists(path.resolve(fullTargetPath, item)))) {
                await fs.symlink(
                  path.resolve(fullSourcePath, item),
                  path.resolve(fullTargetPath, item)
                );
                await recursiveNodeModulesSymlink(
                  path.resolve(fullSourcePath, item),
                  targetPath
                );
              }
            })
          );
        } else if (!(await fs.pathExists(fullTargetPath))) {
          await fs.symlink(fullSourcePath, fullTargetPath);
          await recursiveNodeModulesSymlink(fullSourcePath, targetPath);
        }
      }
    )
  ).catch((err: Err) => {
    if (err.code !== 'EEXIST') throw err;
  });
}

export default class PlatformApi implements IPlatformApi {
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

  async copyDist(distPath: string, config?: Config) {
    if (!config) config = this.getConfig();
    const { paths } = config;
    await fs.copy(distPath, paths.dist);
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
    const lerna = new Set(getLinked()).has('@reactant/cli');
    if (!lerna) {
      await fs.symlink(
        path.resolve(rootPath, 'node_modules'),
        path.resolve(paths.build, 'node_modules')
      );
    } else {
      await recursiveNodeModulesSymlink(rootPath, paths.build);
    }
  }

  async cleanPaths(additionalPaths: string[] = [], config?: Config) {
    if (!config) config = this.getConfig();
    const { paths } = config;
    await Promise.all(
      [paths.build, paths.dist, ...additionalPaths].map(
        async (itemPath: string) => {
          await fs.remove(itemPath);
        }
      )
    );
  }
}
