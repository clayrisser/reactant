import { Context, Options } from '@reactant/types';
import { PlatformApi } from '@reactant/platform';
import { loadConfig } from '@reactant/config';
import { bootstrap, finish } from '@reactant/context';
import logger from '../logger';

export default async function clean(
  platform: string,
  options?: Options
): Promise<Context> {
  const context = bootstrap(loadConfig(), platform, 'clean', options);
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
  finish();
  return result;
}
