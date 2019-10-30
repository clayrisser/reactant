import path from 'path';
import pkgDir from 'pkg-dir';
import { Config, Context, Options, Plugin } from '@reactant/types';
import merge from './merge';
import { CalculatePaths } from './paths';
import { getPlatform } from './platform';
import { loadPlugins } from './plugin';
import { state, syncContext } from '.';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export function masterBootstrap(context: Context): Context {
  const calculatePaths = new CalculatePaths(
    context.paths,
    rootPath,
    context.platformName,
    context.action
  );
  context.paths = calculatePaths.paths;
  return context;
}

export function childBootstrap(context: Context): Context {
  return context;
}

export default function bootstrap(
  initialConfig: Partial<Config>,
  platformName?: string,
  action: string = '',
  options?: Options
): Context {
  return syncContext((context: Context) => {
    if (options) {
      context.options = options;
      context.debug = options.debug;
    }
    if (platformName) context.platformName = platformName;
    context.action = action;
    if (state.isMaster) {
      context = masterBootstrap(context);
    } else {
      context = childBootstrap(context);
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    let config = merge<Partial<Config>>(initialConfig, options?.config || {});
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
      config = context.platform.config(
        config,
        context,
        context.platform.options
      );
    } else {
      config = merge<Partial<Config>>(config, context.platform?.config || {});
    }
    // TODO
    context.plugins = loadPlugins(context);
    Object.entries(context.plugins).forEach(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_pluginName, plugin]: [string, Plugin]) => {
        if (typeof plugin.config === 'function') {
          config = plugin.config(config, context);
        } else {
          config = merge<Partial<Config>>(config, plugin.config);
        }
      }
    );
    config = merge<Partial<Config>>(config, initialConfig);
    context.config = config as Config;
    if (state.isMaster) context.state.ready = true;
    return context;
  }) as Context;
}
