import execa from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { Context, ActionResult, Options, PluginAction } from '@reactant/types';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import { merge } from '@reactant/context';
import { where } from '@reactant/helpers';
import Logger from '../logger';
import runActions from '.';
import { preBootstrap, postBootstrap, postProcess } from '../hooks';

export interface Dependencies {
  [key: string]: string;
}

export interface Pkg {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  name: string;
  peerDependencies?: Dependencies;
}

export default async function install(
  platformName?: string,
  options?: Options,
  pluginActions: PluginAction[] = []
): Promise<ActionResult> {
  const context = bootstrap(
    loadConfig(),
    platformName,
    'install',
    options,
    preBootstrap,
    postBootstrap
  );
  const logger = new Logger(context.logLevel);
  await runActions(context, logger, pluginActions);
  const pkgPath = path.resolve(context.paths.root, 'package.json');
  const installedPath = path.resolve(
    context.paths.root,
    'node_modules/.tmp/reactant/installed'
  );
  if (!(await fs.pathExists(installedPath))) {
    const pkg: Pkg = await fs.readJson(pkgPath);
    pkg.dependencies = getReactantDependencies(pkg.dependencies || {});
    pkg.devDependencies = getReactantDependencies(pkg.devDependencies || {});
    pkg.peerDependencies = {};
    await installDependencies(pkg, context, logger);
    await fs.writeFile(installedPath, '');
    await new Promise((r) => setTimeout(r, 300));
  }
  const pkg: Pkg = await fs.readJson(pkgPath);
  if (!platformName) {
    await Promise.all(
      context.platformNames.map(async (platformName: string) => {
        const platformPkgPath = path.resolve(
          context.paths.root,
          platformName,
          'package.json'
        );
        if (await fs.pathExists(platformPkgPath)) {
          const platformPkg: Pkg = await fs.readJson(platformPkgPath);
          mergeDependencies(pkg, platformPkg);
        }
      })
    );
  } else {
    const platformPkgPath = path.resolve(
      context.paths.root,
      context.platformName,
      'package.json'
    );
    if (await fs.pathExists(platformPkgPath)) {
      const platformPkg = await fs.readJson(platformPkgPath);
      mergeDependencies(pkg, platformPkg);
    }
  }
  await installDependencies(pkg, context, logger);
  postProcess(context, logger);
  return null;
}

export function mergeDependencies(pkg: Pkg, newPkg: Partial<Pkg>): Pkg {
  pkg.dependencies = merge(pkg.dependencies || {}, newPkg.dependencies || {});
  pkg.devDependencies = merge(
    pkg.devDependencies || {},
    newPkg.devDependencies || {}
  );
  pkg.peerDependencies = merge(
    pkg.peerDependencies || {},
    newPkg.peerDependencies || {}
  );
  return pkg;
}

export function getReactantDependencies(dependencies: Dependencies) {
  return Object.entries(dependencies).reduce(
    (dependencies: Dependencies, [dependency, version]: [string, string]) => {
      if (dependency.substr(0, 10) === '@reactant/') {
        dependencies[dependency] = version;
      }
      return dependencies;
    },
    {}
  );
}

export async function installDependencies(
  pkg: Pkg,
  context: Context,
  logger: Logger
) {
  let command =
    (await where(context.config?.preferredPackageManager || '')) || '';
  if (!command?.length) command = (await where('pnpm')) || '';
  if (!command?.length) command = (await where('yarn')) || '';
  if (!command?.length) command = (await where('npm')) || '';
  if (!command?.length) {
    throw new Error("please install 'pnpm', 'yarn' or 'npm'");
  }
  const pkgPath = path.resolve(context.paths.root, 'package.json');
  const pkgBackupPath = path.resolve(
    context.paths.root,
    'package.json.reactant_backup'
  );
  await fs.rename(pkgPath, pkgBackupPath);
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  if (context.debug) logger.debug(pkg);
  await execa(command, ['install'], {
    stdio: 'inherit',
    cwd: context.paths.root,
  });
  await fs.remove(pkgPath);
  await fs.rename(pkgBackupPath, pkgPath);
}
