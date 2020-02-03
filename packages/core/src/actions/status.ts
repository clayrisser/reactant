import { Context, Options, Status } from '@reactant/types';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import Logger from '../logger';
import { preBootstrap, postBootstrap, postProcess, preProcess } from '../hooks';

export default async function status(
  platform: string,
  options?: Options
): Promise<Context> {
  const pkg = require('../../package.json');
  const context = bootstrap(
    loadConfig(),
    platform,
    'status',
    options,
    preBootstrap,
    postBootstrap
  );
  const logger = new Logger(context.logLevel);
  await preProcess(context, logger);
  const status: Status = {
    version: pkg.version
  };
  logger.info(status);
  await postProcess(context, logger);
  return context;
}
