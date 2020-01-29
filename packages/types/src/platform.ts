import { ExecaReturnValue, Options as ExecaOptions } from 'execa';
import { Config } from './config';
import { Context } from './context';
import { Logger } from './core';

export interface CreateConfigOptions {
  rootPath?: boolean;
}

export interface TPlatformApi {
  context: Context;
  logger: Logger;
  prepareLocal(): Promise<void>;
  createWebpackConfig(options?: CreateConfigOptions): Promise<void>;
  createBabelConfig(options?: CreateConfigOptions): Promise<void>;
  spawn(
    pkg: string | null,
    bin: string,
    args?: string[],
    options?: ExecaOptions
  ): Promise<ExecaReturnValue<string>>;
}

export type PlatformOption = any;

export interface PlatformOptions<T = any> {
  _T?: T; // use T to fix warning (should be removed)
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
  build: Action;
  clean: Action;
  start: Action;
  storybook: Action;
  test: Action;
}

export interface Platform {
  actions?: Actions;
  config?: ModifyPlatformConfigFunction;
  defaultOptions?: Partial<PlatformOptions>;
  name?: string;
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
  context: Context,
  options: PlatformOptions
) => Partial<Config>;
