import { Config } from './config';
import { Context } from './context';

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

export interface PluginsOptions {
  [key: string]: PluginOptions;
}

export type ModifyPluginConfigFunction = (
  config: Partial<Config>,
  context?: Partial<Context>
) => Partial<Config>;
