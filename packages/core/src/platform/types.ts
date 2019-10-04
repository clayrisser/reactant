import { Config, Logger, ModifyConfigFunction } from '../types';

export type CalculatedPlatforms = Platforms<CalculatedPlatform>;
export type PlatformOption = any;
export type SpawnOptions = import('child_process').SpawnOptions;
export type Action = (
  config?: Config,
  logger?: Logger,
  platformApi?: PlatformApi
) => any;

export interface Platform {
  actions: Actions;
  config?: Config | ModifyConfigFunction;
  defaultOptions?: Partial<PlatformOptions>;
  name?: string;
}

export interface CalculatedPlatform extends Platform {
  defaultOptions: undefined;
  moduleName: string;
  name: string;
  options: PlatformOptions;
  origionalName: string;
  path: string;
}

export interface Platforms<TPlatform = Platform> {
  [key: string]: TPlatform;
}

export interface PlatformOptions {
  name?: string;
  [key: string]: PlatformOption;
}

export interface PlatformsOptions {
  [key: string]: PlatformsOptions;
}

export interface PlatformApi {
  config: Config;
  options: PlatformOptions;
  spawn(
    pkg: string,
    bin: string,
    args?: string[],
    options?: SpawnOptions
  ): Promise<string | import('child_process').ChildProcess>;
  createCracoConfig(
    cracoConfigPath?: string | null,
    config?: Config
  ): Promise<void>;
  createWebpackConfig(
    webpackConfigPath?: string | null,
    config?: Config
  ): Promise<void>;
  copyDist(distPath: string, config?: Config): Promise<void>;
  prepareBuild(config?: Config): Promise<void>;
  prepareLocal(config?: Config): Promise<void>;
  cleanPaths(additionalPaths?: string[], config?: Config): Promise<void>;
}

export interface Actions {
  [key: string]: Action;
}
