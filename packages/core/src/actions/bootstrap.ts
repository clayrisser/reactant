import { Config, Context, Options, Plugin } from '@reactant/types';
import { loadConfig, mergeConfig } from '@reactant/config';
import { mapSeries } from 'bluebird';
import { syncContext } from '@reactant/context';
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
    context.userConfig = loadConfig();
    context.config = context.userConfig;
    return context;
  });
  await syncContext(async (context: Context) => {
    context.platform = await loadPlatform(context);
    if (typeof context.platform.config === 'function') {
      context.config = await context.platform.config(context.config);
    } else {
      context.config = mergeConfig<Partial<Config>>(
        context.config,
        context.platform.config
      );
    }
    return context;
  });
  await syncContext(async (context: Context) => {
    context.plugins = await loadPlugins(context);
    await mapSeries(
      Object.entries(context.plugins),
      async ([_pluginName, plugin]: [string, Plugin]) => {
        if (typeof plugin.config === 'function') {
          context.config = await plugin.config(context.config);
        } else {
          context.config = mergeConfig<Partial<Config>>(
            context.config,
            plugin.config
          );
        }
      }
    );
    return context;
  });
  return syncContext(async (context: Context) => {
    context.config = mergeConfig<Partial<Config>>(
      context.config,
      context.userConfig
    );
    return context;
  });
}
