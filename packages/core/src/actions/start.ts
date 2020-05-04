import fs from 'fs-extra';
import path from 'path';
import { ActionResult, Options, PluginAction } from '@reactant/types';
import { Api } from '@reactant/helpers';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import Logger from '../logger';
import runActions from '.';
import { preBootstrap, postBootstrap, postProcess } from '../hooks';

export default async function start(
  platform: string,
  options?: Options,
  pluginActions: PluginAction[] = []
): Promise<ActionResult> {
  const context = bootstrap(
    loadConfig(),
    platform,
    'start',
    options,
    preBootstrap,
    postBootstrap
  );
  const logger = new Logger(context.logLevel);
  const api = new Api(context, logger);
  if (!context.platform?.actions?.start) {
    throw new Error(
      `platform '${context.platformName}' missing action 'start'`
    );
  }
  const platformReactantBackupPath = path.resolve(
    context.platform.path,
    'lib/Reactant.backup.js'
  );
  if (await fs.pathExists(platformReactantBackupPath)) {
    await fs.rename(
      platformReactantBackupPath,
      path.resolve(context.platform.path, 'lib/Reactant.js')
    );
  }
  await runActions(context, logger, pluginActions);
  await context.platform.actions.start(context, logger, api);
  postProcess(context, logger);
  return null;
}
