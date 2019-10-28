import { Context, Options } from '@reactant/types';
import { PlatformApi } from '@reactant/platform';
import { finish } from '@reactant/context';
import bootstrap from './bootstrap';
import logger from '../logger';

export default async function build(
  platform: string,
  options: Options = {}
): Promise<Context> {
  const context = await bootstrap(platform, options);
  const platformApi = new PlatformApi(context, logger);
  // eslint-disable-next-line no-undef
  const result = await context.platform?.actions.build(
    context,
    logger,
    platformApi
  );
  finish();
  return result;
}
