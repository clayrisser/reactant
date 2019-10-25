import { Context, Options, syncContext } from '@reactant/context';
import { loadPlatform } from '../platform';
import { loadPlugins } from '../plugin';

export default async function bootstrap(
  platform: string,
  options: Options = {}
): Promise<Context> {
  await syncContext(async (context: Context) => {
    context.options = options;
    context.platformName = platform;
    return context;
  });
  await syncContext(async (context: Context) => {
    context.platform = await loadPlatform(context);
    return context;
  });
  return syncContext(async (context: Context) => {
    context.plugins = await loadPlugins(context);
    return context;
  });
}
