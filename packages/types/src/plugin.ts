import { Config } from './config';
import { Context } from './context';

export interface Plugin {
  config: ModifyPluginConfigFunction;
  defaultOptions: Partial<PluginOptions>;
  name: string;
  supportedPlatforms: string[];
}

export interface LoadedPlugin {
  config: ModifyPluginConfigFunction;
  moduleName: string;
  name: string;
  options: PluginOptions;
  origionalName: string;
  path: string;
  supportedPlatforms: string[];
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
