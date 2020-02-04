import { ActionResult, Options } from '@reactant/types';
import { PlatformApi } from '@reactant/platform';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import Logger from '../logger';
import runActions from '.';
import { preBootstrap, postBootstrap, postProcess } from '../hooks';

export default async function storybook(
  platform: string,
  options?: Options
): Promise<ActionResult> {
  const context = bootstrap(
    loadConfig(),
    platform,
    'storybook',
    options,
    preBootstrap,
    postBootstrap
  );
  const logger = new Logger(context.logLevel);
  const platformApi = new PlatformApi(context, logger);
  if (!context.platform?.actions?.start) {
    throw new Error(
      `platform '${context.platformName}' missing action 'storybook'`
    );
  }
  await runActions(context, logger, []);
  await context.platform?.actions.storybook(context, logger, platformApi);
  postProcess(context, logger);
  return null;
}
