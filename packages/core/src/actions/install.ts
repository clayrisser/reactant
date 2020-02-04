import execa from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { ActionResult, Options, PluginAction } from '@reactant/types';
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
  let command = (await where('pnpm')) || '';
  if (!command?.length) command = (await where('yarn')) || '';
  if (!command?.length) command = (await where('npm')) || '';
  if (!command?.length) {
    throw new Error("please install 'pnpm', 'yarn' or 'npm'");
  }
  if (!platformName) {
    await Promise.all(
      context.platformNames.map(async (platformName: string) => {
        if (
          !(await fs.pathExists(
            path.resolve(
              context.paths.root,
              context.platformName,
              'node_modules'
            )
          ))
        ) {
          await execa(command, ['install'], {
            stdio: 'inherit',
            cwd: path.resolve(context.paths.root, platformName)
          });
        }
      })
    );
  } else {
    await execa(command, ['install'], {
      stdio: 'inherit',
      cwd: path.resolve(context.paths.root, context.platformName)
    });
  }
  postProcess(context, logger);
  return null;
}
