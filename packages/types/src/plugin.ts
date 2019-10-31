import { Config } from './config';
import { Context } from './context';

export interface Plugin {
  config: ModifyPluginConfigFunction;
  defaultOptions: Partial<PluginOptions>;
  disabledPlatforms: string[] | Set<string>;
  name: string;
  supportedPlatforms: string[] | Set<string>;
}

export interface LoadedPlugin {
  config: ModifyPluginConfigFunction;
  disabledPlatforms: Set<string>;
  moduleName: string;
  name: string;
  options: PluginOptions;
  origionalName: string;
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
