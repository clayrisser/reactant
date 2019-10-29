import { Config, Context, Options, Plugin } from '@reactant/types';
import merge from './merge';
// import { CalculatePaths } from './paths';
import { getPlatform } from './platform';
import { loadPlugins } from './plugin';

export default function bootstrap(
  context: Context,
  initialConfig: Partial<Config>,
  platformName?: string,
  options?: Options
): Context {
  if (options) context.options = options;
  if (platformName) context.platformName = platformName;
  let config = initialConfig;
  config.platform = config?.platforms?.[context.platformName] || {};
  const platform = getPlatform(
    context.platformName,
    context.paths.root,
    config.platform
  );
  if (!platform) {
    throw new Error(`platform '${context.platformName}' not installed`);
  }
  context.platform = platform;
  if (typeof context.platform?.config === 'function') {
    config = context.platform.config(config);
  } else {
    config = merge<Partial<Config>>(config, context.platform?.config || {});
  }
  // TODO
  context.plugins = loadPlugins(context);
  Object.entries(context.plugins).forEach(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_pluginName, plugin]: [string, Plugin]) => {
      if (typeof plugin.config === 'function') {
        config = plugin.config(config);
      } else {
        config = merge<Partial<Config>>(config, plugin.config);
      }
    }
  );
  config = merge<Partial<Config>>(config, initialConfig);
  context.config = config as Config;
  return context;
}

// const calculatePaths = new CalculatePaths(
//   config.paths,
//   config.rootPath,
//   config.platformName,
//   config.action
// );
// config.paths = calculatePaths.paths;