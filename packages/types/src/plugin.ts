import { ActionResult, Api, Context, Config, Logger } from '.';

export type PluginAction = (
  context: Context,
  logger: Logger,
  platformApi: Api
) => Promise<ActionResult>;

export interface PluginActions {
  [key: string]: PluginAction;
}

export interface Plugin {
  actions?: PluginActions;
  config?: ModifyPluginConfigFunction;
  defaultOptions?: Partial<PluginOptions>;
  disabledPlatforms?: string[] | Set<string>;
  name?: string;
  supportedPlatforms?: string[] | Set<string>;
}

export interface LoadedPlugin {
  actions: PluginActions;
  config: ModifyPluginConfigFunction;
  disabledPlatforms: Set<string>;
  moduleName: string;
  name: string;
  options: PluginOptions;
  path: string;
  supportedPlatforms: Set<string>;
}

export interface LoadedPlugins {
  [key: string]: LoadedPlugin;
}

export interface Plugins {
  [key: string]: Plugin;
}

export type PluginOption = any;

export interface PluginOptions {
  [key: string]: PluginOption;
}

export interface PluginsOptions {
  [key: string]: PluginOptions;
}

export type ModifyPluginConfigFunction = (
  config: Partial<Config>,
  context: Context,
  options: PluginOptions
) => Partial<Config>;
