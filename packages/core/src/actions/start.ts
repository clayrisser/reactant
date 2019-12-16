import { Context, Options } from '@reactant/types';
import { PlatformApi } from '@reactant/platform';
import { bootstrap } from '@reactant/context';
import { loadConfig } from '@reactant/config';
import Logger from '../logger';
import { preProcess, postProcess } from '.';

export default async function start(
  platform: string,
  options?: Options
): Promise<Context> {
  const context = bootstrap(loadConfig(), platform, 'start', options);
  const logger = new Logger(context.logLevel);
  await preProcess(context, logger);
  const platformApi = new PlatformApi(context, logger);
  // eslint-disable-next-line no-undef
  if (!context.platform?.actions?.start) {
    throw new Error(
      `platform '${context.platformName}' missing action 'start'`
    );
  }
  // eslint-disable-next-line no-undef
  const result = await context.platform.actions.start(
    context,
    logger,
    platformApi
  );
  await postProcess(context, logger);
  return result;
}
