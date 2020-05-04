import { ActionResult, Options, PluginAction } from '@reactant/types';
import { Api } from '@reactant/helpers';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import Logger from '../logger';
import runActions from '.';
import { preBootstrap, postBootstrap, postProcess } from '../hooks';

export default async function test(
  platform: string,
  options?: Options,
  pluginActions: PluginAction[] = []
): Promise<ActionResult> {
  const context = bootstrap(
    loadConfig(),
    platform,
    'test',
    options,
    preBootstrap,
    postBootstrap
  );
  const logger = new Logger(context.logLevel);
  const api = new Api(context, logger);
  if (!context.platform?.actions?.start) {
    throw new Error(`platform '${context.platformName}' missing action 'test'`);
  }
  await runActions(context, logger, pluginActions);
  await context.platform?.actions.test(context, logger, api);
  postProcess(context, logger);
  return null;
}
