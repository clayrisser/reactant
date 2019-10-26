import { Context, Options, syncContext } from '@reactant/context';
import { Plugin } from '@reactant/plugin';
import { getConfig } from '@reactant/config';
import { mapSeries } from 'bluebird';
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
    // TODO 0
    context.config = getConfig();
    return context;
  });
  await syncContext(async (context: Context) => {
    context.platform = await loadPlatform(context);
    context.config = await context.platform.config(context.config);
    return context;
  });
  return syncContext(async (context: Context) => {
    context.plugins = await loadPlugins(context);
    await mapSeries(
      Object.entries(context.plugins),
      async ([_pluginName, plugin]: [string, Plugin]) => {
        context.config = await plugin.config(context.config);
      }
    );
    return context;
  });
}
