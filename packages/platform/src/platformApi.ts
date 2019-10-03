import Err from 'err';
import asyncCrossSpawn from 'async-cross-spawn';
import fs from 'fs-extra';
import ncp from 'ncp-promise';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Config, getConfig, updateConfig } from '@reactant/core';
import { SpawnOptions } from 'child_process';
import { getLinked } from 'linked-deps';
import { oc } from 'ts-optchain.macro';

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
  ).catch((err: Err) => {
    if (err.code !== 'EEXIST') throw err;
  });
}

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

  async createCracoConfig(cracoConfigPath?: string | null, config?: Config) {
    if (!config) config = this.getConfig();
    const { paths } = config;
    if (!cracoConfigPath) {
      cracoConfigPath = path.resolve(paths.tmp, 'craco.config.js');
    }
    if (await fs.pathExists(cracoConfigPath)) await fs.unlink(cracoConfigPath);
    await fs.copy(
      path.resolve(__dirname, 'templates/craco.config.js'),
      cracoConfigPath
    );
  }

  async createWebpackConfig(
    webpackConfigPath?: string | null,
    config?: Config
  ) {
    if (!config) config = this.getConfig();
    const { paths } = config;
    if (!webpackConfigPath) {
      webpackConfigPath = path.resolve(paths.tmp, 'webpack.config.js');
    }
    await this.createCracoConfig(
      oc(webpackConfigPath.match(/[^/]+$/))[0](paths.tmp),
      config
    );
    if (await fs.pathExists(webpackConfigPath)) {
      await fs.unlink(webpackConfigPath);
    }
    await fs.copy(
      path.resolve(__dirname, 'templates/webpack.config.js'),
      webpackConfigPath
    );
  }

  async copyDist(distPath: string, config?: Config) {
    if (!config) config = this.getConfig();
    const { paths } = config;
    await fs.copy(distPath, paths.dist);
  }

  async prepareBuild(config?: Config) {
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

  async prepareLocal(config?: Config) {
    if (!config) config = this.getConfig();
    const { rootPath } = config;
    const lerna = new Set(getLinked()).has('@reactant/cli');
    if (lerna) await recursiveNodeModulesSymlink(rootPath, rootPath);
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
