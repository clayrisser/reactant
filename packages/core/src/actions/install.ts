import execa from 'execa';
import path from 'path';
import { Context, Options } from '@reactant/types';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import Logger from '../logger';
import where from '../where';
import { preBootstrap, postBootstrap, postProcess, preProcess } from '../hooks';

export default async function install(
  platform: string,
  options?: Options
): Promise<Context> {
  const context = bootstrap(
    loadConfig(),
    platform,
    'install',
    options,
    preBootstrap,
    postBootstrap
  );
  const logger = new Logger(context.logLevel);
  await preProcess(context, logger);
  let command = await where('pnpm');
  if (!command?.length) command = await where('yarn');
  if (!command?.length) command = await where('npm');
  if (!command || !command.length) {
    throw new Error("please install 'pnpm', 'yarn' or 'npm'");
  }
  await execa(command, ['install'], {
    stdio: 'inherit',
    cwd: path.resolve(context.paths.root, context.platformName)
  });
  await postProcess(context, logger);
  return context;
}
