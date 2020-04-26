import execa from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { Context, ActionResult, Options, PluginAction } from '@reactant/types';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import { where } from '@reactant/helpers';
import Logger from '../logger';
import runActions from '.';
import { preBootstrap, postBootstrap, postProcess } from '../hooks';

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
  await installDependencies(context);
  postProcess(context, logger);
  return null;
}

export async function installDependencies(context: Context) {
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
  await fs.writeJson(pkgPath, context.pkg, { spaces: 2 });
  await execa(command, ['install'], {
    stdio: 'inherit',
    cwd: context.paths.root
  });
  await fs.remove(pkgPath);
  await fs.rename(pkgBackupPath, pkgPath);
}
