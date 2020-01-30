import { Context, Options } from '@reactant/types';
import { PlatformApi } from '@reactant/platform';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import Logger from '../logger';
import { preBootstrap, postBootstrap, postProcess, preProcess } from '../hooks';

export default async function clean(
  platform: string,
  options?: Options
): Promise<Context> {
  const context = bootstrap(
    loadConfig(),
    platform,
    'clean',
    options,
    preBootstrap,
    postBootstrap
  );
  const logger = new Logger(context.logLevel);
  await preProcess(context, logger);
  const platformApi = new PlatformApi(context, logger);
  // eslint-disable-next-line no-undef
  if (!context.platform?.actions?.start) {
    throw new Error(
      `platform '${context.platformName}' missing action 'clean'`
    );
  }
  // eslint-disable-next-line no-undef
  const result = await context.platform?.actions.clean(
    context,
    logger,
    platformApi
  );
  await postProcess(context, logger);
  return result;
}
