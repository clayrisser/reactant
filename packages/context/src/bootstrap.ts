import { Config, Context, Options, Plugin } from '@reactant/types';
import merge from './merge';
import { loadPlatform } from './platform';
import { loadPlugins } from './plugin';

export default function bootstrap(
  context: Context,
  config: Config,
  platformName?: string,
  options: Options = {}
): Context {
  if (options) context.options = options;
  if (platformName) context.platformName = platformName;
  context.config = config;
  context.platform = loadPlatform(context);
  context.plugins = loadPlugins(context);
  Object.entries(context.plugins).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_pluginName, plugin]: [string, Plugin]) => {
      if (typeof plugin.config === 'function') {
        context.config = plugin.config(context.config);
      } else {
        context.config = merge<Partial<Config>>(context.config, plugin.config);
      }
    }
  );
  context.config = merge<Partial<Config>>(context.config, config);
  return context;
}
