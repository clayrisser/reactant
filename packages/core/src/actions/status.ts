import { ActionResult, Options, Status } from '@reactant/types';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import Logger from '../logger';
import runActions from '.';
import { preBootstrap, postBootstrap, postProcess } from '../hooks';

export default async function status(
  platform: string,
  options?: Options
): Promise<ActionResult> {
  // eslint-disable-next-line global-require
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
  await runActions(context, logger, []);
  const status: Status = {
    version: pkg.version
  };
  logger.info(status);
  postProcess(context, logger);
  return null;
}
