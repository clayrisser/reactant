import { Config } from '@reactant/config';
import { Logger } from '@ecosystem/core';

export type PlatformOption = any;

export interface PlatformOptions {
  [key: string]: PlatformOption;
}

export interface Platform {
  actions: Actions;
  defaultOptions?: Partial<PlatformOptions>;
  name?: string;
}

export interface CalculatedPlatform extends Platform {
  moduleName: string;
  name: string;
  options: PlatformOptions;
}

export interface Platforms<TPlatform = Platform> {
  [key: string]: TPlatform;
}

export type CalculatedPlatforms = Platforms<CalculatedPlatform>;

export type Action = (config?: Config, logger?: Logger) => any;

export interface Actions {
  [key: string]: Action;
}

export { Logger, Config };
