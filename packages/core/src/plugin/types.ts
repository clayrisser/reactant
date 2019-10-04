import { Config, ModifyConfigFunction } from '../types';

export type CalculatedPlugins = Plugins<CalculatedPlugin>;
export type PluginOption = any;

export interface PluginOptions {
  name?: string;
  supportedPlatforms?: string[];
  [key: string]: PluginOption;
}

export interface Plugin {
  config?: Config | ModifyConfigFunction;
  defaultOptions?: Partial<PluginOptions>;
  name?: string;
  supportedPlatforms?: string[];
}

export interface CalculatedPlugin extends Plugin {
  defaultOptions: undefined;
  moduleName: string;
  name: string;
  options: PluginOptions;
  origionalName: string;
  path: string;
  supportedPlatforms: string[];
}

export interface Plugins<TPlugin = Plugin> {
  [key: string]: TPlugin;
}

export interface PluginsOptions {
  [key: string]: PluginsOptions;
}
