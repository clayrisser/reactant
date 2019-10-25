import { Config } from '@reactant/config';

export interface Plugin {
  config: ModifyPluginConfigFunction;
  defaultOptions: Partial<PluginOptions>;
  name: string;
  supportedPlatforms: string[];
}

export interface Plugins {
  [key: string]: Plugin;
}

export type PluginOption = any;

export interface PluginOptions {
  supportedPlatforms: string[];
  [key: string]: PluginOption;
}

export type ModifyPluginConfigFunction = (
  config: Config,
  pluginOptions?: PluginOptions
) => Config;
