import { Config as BaseConfig } from '@ecosystem/core';

export type BabelOptions = import('@babel/core').TransformOptions;
export type BabelPlugin = import('@babel/core').PluginItem;
export type CalculatedPlatforms = Platforms<CalculatedPlatform>;
export type CracoDevServer = WebpackConfig | Function;
export type Function = (...args: any[]) => any;
export type Logger = import('@ecosystem/core').Logger;
export type PlatformOption = any;
export type Port = number | boolean | null;
export type SpawnOptions = import('child_process').SpawnOptions;
export type WebpackConfig = import('webpack').Configuration;
export type Action = (
  config?: Config,
  logger?: Logger,
  platformApi?: PlatformApi
) => any;

export interface Actions {
  [key: string]: Action;
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

export interface Ports {
  [key: string]: Port;
}

export interface Paths {
  build: string;
  dist: string;
  platform: string;
  tmp: string;
  [key: string]: string;
}

export interface PlatformOptions {
  [key: string]: PlatformOption;
}

export interface JestConfig {
  [key: string]: any;
}

export interface EslintOptions {
  [key: string]: any;
}

export interface EslintLoaderOptions {
  [key: string]: any;
}

export interface CracoTypeScript {
  enableTypeChecking?: boolean;
}

export interface CracoEslint {
  enable?: boolean;
  mode?: string;
  configure?: EslintOptions | Function;
  loaderOptions?: EslintLoaderOptions | Function;
}

export interface CracoBabel {
  presets?: BabelPlugin[];
  plugins?: BabelPlugin[];
  loaderOptions?: BabelOptions | Function;
}

export interface CracoStyle {
  modules?: object;
  css?: object;
  sass?: object;
  postcss?: object;
}

export interface CracoWebpack {
  alias?: object;
  plugins?: CracoPlugin[];
  configure?: WebpackConfig | Function;
}

export interface CracoJestBabel {
  addPresets?: boolean;
  addPlugins?: boolean;
}

export interface CracoJest {
  babel?: CracoJestBabel;
  configure?: JestConfig | Function;
}

export interface CracoPlugin {
  [key: string]: any;
}

export interface CracoConfig {
  reactScriptsVersion?: string;
  style?: CracoStyle;
  babel?: CracoBabel;
  eslint?: CracoEslint;
  jest?: CracoJest;
  typescript?: CracoTypeScript;
  webpack?: CracoWebpack;
  devServer?: CracoDevServer;
  plugins?: CracoPlugin[];
}

export interface ConfigState {
  [key: string]: any;
  initialized?: boolean;
  ready?: boolean;
  setPaths?: boolean;
  setPorts?: boolean;
}

export interface Config extends BaseConfig {
  [key: string]: any;
  _state: ConfigState;
  babel?: CracoBabel;
  basePort: number;
  craco: CracoConfig;
  cracoPlugins?: CracoPlugin[];
  debug: boolean;
  devServer?: CracoDevServer;
  eslint?: CracoEslint;
  jest?: CracoJest;
  paths: Paths;
  platform: PlatformOptions;
  platformName: string;
  ports: Ports;
  reactScriptsVersion?: string;
  style?: CracoStyle;
  typescript?: CracoTypeScript;
  webpack?: CracoWebpack;
}

export interface PlatformApi {
  config: Config;
  getConfig(): Config;
  updateConfig(config: Config): Config;
  spawn(
    pkg: string,
    bin: string,
    args?: string[],
    options?: SpawnOptions
  ): Promise<string | import('child_process').ChildProcess>;
  createCracoConfig(parentPath?: string | null, config?: Config): Promise<void>;
  createWebpackConfig(parentPath?: string, config?: Config): Promise<void>;
  copyDist(distPath: string, config?: Config): Promise<void>;
  prepare(config?: Config): Promise<void>;
  cleanPaths(additionalPaths?: string[], config?: Config): Promise<void>;
}

export interface Plugin {
  defaultOptions?: Partial<PluginOptions>;
  name?: string;
}

export type PluginOption = any;

export interface PluginOptions {
  [key: string]: PluginOption;
}

export interface Plugins<TPlugin = Plugin> {
  [key: string]: TPlugin;
}

export interface CalculatedPlugin extends Plugin {
  moduleName: string;
  name: string;
  options: PluginOptions;
}

export type CalculatedPlugins = Plugins<CalculatedPlugin>;
