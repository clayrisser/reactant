import pkgDir from 'pkg-dir';
import {
  Config,
  Context,
  ContextEnvs,
  Envs,
  LoadedPlugin,
  Options,
  PluginOptions
} from '@reactant/types';
import merge from './merge';
import { CalculatePaths } from './paths';
import { getPlatform } from './platform';
import { getPlugins } from './plugin';
import { state, syncContext } from '.';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export function loadEnvs(envs?: Envs): ContextEnvs {
  if (!envs) return {};
  return Object.entries(envs).reduce(
    (envs: ContextEnvs, [key, env]: [string, string | null]) => {
      if (process.env[key]) {
        envs[key] = process.env[key] || '';
      } else {
        envs[key] = env || '';
      }
      return envs;
    },
    {}
  );
}

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
    context.envs = loadEnvs(initialConfig.envs);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    let config = merge<Partial<Config>>(initialConfig, options?.config || {});
    const platformOrigionalName =
      Object.keys(config?.platforms || {}).find((key: string) => {
        const platform = config.platforms?.[key] || {};
        return platform.name === context.platformName;
      }) || context.platformName;
    const platformOptions = config?.platforms?.[platformOrigionalName] || {};
    const platform = getPlatform(
      platformOrigionalName,
      context.paths.root,
      platformOptions
    );
    if (!platform) {
      throw new Error(`platform '${context.platformName}' not installed`);
    }
    context.platform = platform;
    context.envs = loadEnvs({
      ...context.envs,
      ...platform.options.envs
    });
    if (typeof context.platform?.config === 'function') {
      config = context.platform.config(
        config,
        context,
        context.platform.options
      );
    } else {
      config = merge<Partial<Config>>(config, context.platform?.config || {});
    }
    context.plugins = getPlugins(context.paths.root);
    Object.entries(context.plugins).forEach(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([pluginName, plugin]: [string, LoadedPlugin]) => {
        plugin.options = merge<PluginOptions>(
          plugin.options,
          config.plugins?.[pluginName] || {}
        );
        context.envs = loadEnvs({
          ...context.envs,
          ...plugin.options.envs
        });
        plugin.supportedPlatforms = new Set([
          ...plugin.supportedPlatforms,
          ...(plugin.options?.supportedPlatforms || [])
        ]);
        plugin.disabledPlatforms = new Set([
          ...plugin.disabledPlatforms,
          ...(plugin.options?.disabledPlatforms || [])
        ]);
        if (
          plugin.supportedPlatforms.has(context.platformName) &&
          !plugin.disabledPlatforms.has(context.platformName)
        ) {
          if (typeof plugin.config === 'function') {
            config = plugin.config(config, context, plugin.options);
          } else {
            config = merge<Partial<Config>>(config, plugin.config);
          }
        } else {
          delete context.plugins[pluginName];
        }
      }
    );
    config = merge<Partial<Config>>(config, initialConfig);
    context.config = config as Config;
    if (context.debug) context.logLevel = 'silly';
    if (state.isMaster) context.state.ready = true;
    return context;
  }) as Context;
}
