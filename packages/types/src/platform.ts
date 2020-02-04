import { ExecaReturnValue, Options as ExecaOptions } from 'execa';
import { ActionResult, Context, Config, Logger } from '.';

export type PlatformAction = (
  context: Context,
  logger: Logger,
  platformApi: TPlatformApi
) => Promise<ActionResult>;

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
    bin: string | string[],
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

export interface PlatformActions {
  build: PlatformAction;
  clean: PlatformAction;
  start: PlatformAction;
  storybook: PlatformAction;
  test: PlatformAction;
  [key: string]: PlatformAction;
}

export interface Platform {
  actions?: PlatformActions;
  config?: ModifyPlatformConfigFunction;
  defaultOptions?: Partial<PlatformOptions>;
  name?: string;
}

export interface LoadedPlatform {
  actions: PlatformActions;
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
