import { Config } from './config';
import { Context } from './context';
import { Logger } from './core';

export default class PlatformApi {
  constructor(public context: Context, public logger: Logger) {}
}

export type PlatformOption = any;

export interface PlatformOptions {
  [key: string]: PlatformOption;
}

export interface PlatformsOptions {
  [key: string]: PlatformOptions;
}

export type Action = (
  context: Context,
  logger: Logger,
  platformApi: PlatformApi
) => Promise<any>;

export interface Actions {
  [key: string]: Action;
}

export interface Platform {
  actions: Actions;
  config: ModifyPlatformConfigFunction;
  defaultOptions: Partial<PlatformOptions>;
  name: string;
}

export interface LoadedPlatform {
  actions: Actions;
  config: ModifyPlatformConfigFunction;
  moduleName: string;
  name: string;
  options: PlatformOptions;
  origionalName: string;
  path: string;
}

export interface LoadedPlatforms {
  [key: string]: LoadedPlatform;
}

export type ModifyPlatformConfigFunction = (
  config: Partial<Config>,
  platformOptions?: PlatformOptions
) => Partial<Config>;
