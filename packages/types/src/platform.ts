import { ChildProcess, SpawnOptions } from 'child_process';
import { Config } from './config';
import { Context } from './context';
import { Logger } from './core';

export interface CreateConfigOptions {
  rootPath?: boolean;
}

export interface TPlatformApi {
  context: Context;
  logger: Logger;
  spawn(
    pkg: string,
    bin: string,
    args?: string[],
    options?: SpawnOptions
  ): Promise<string | ChildProcess>;
  createWebpackConfig(options?: CreateConfigOptions): Promise<void>;
  createBabelConfig(options?: CreateConfigOptions): Promise<void>;
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
  platformApi: TPlatformApi
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
