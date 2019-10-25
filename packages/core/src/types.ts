import { Actions } from '@reactant/platform';

export interface Platform {
  actions: Actions;
  config: Config | ModifyConfigFunction;
  defaultOptions: Partial<PlatformOptions>;
  name: string;
}

export interface Plugin {
  config: Config | ModifyConfigFunction;
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

export type PlatformOption = any;
export interface PlatformOptions {
  [key: string]: PlatformOption;
}

// export type Action = (
//   context?: Context,
//   logger?: Logger,
//   platformApi?: PlatformApi
// ) => any;
// export interface Actions {
//   [key: string]: Action;
// }

export type ModifyConfigFunction = (
  config: Config,
  platformOptions?: PlatformOptions
) => Config;
