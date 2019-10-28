import { Context, Options, finish } from '@reactant/context';
import bootstrap from './bootstrap';

export default async function build(
  platform: string,
  options: Options = {}
): Promise<Context> {
  const context = await bootstrap(platform, options);
  // TODO
  const logger = null;
  const platformApi = null;
  const result = await context.platform.actions.build(
    context,
    logger,
    platformApi
  );
  finish();
  return result;
}
