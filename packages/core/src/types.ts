import { Config as BaseConfig } from '@ecosystem/core';
import { CalculatedPlugins, PluginsOptions } from './plugin';
import {
  PlatformsOptions,
  PlatformOptions,
  CalculatedPlatform
} from './platform';

export type BabelOptions = import('@babel/core').TransformOptions;
export type BabelPlugin = import('@babel/core').PluginItem;
export type CracoDevServer = WebpackConfig | Function;
export type Function = (...args: any[]) => any;
export type Logger = import('@ecosystem/core').Logger;
export type Port = number | boolean | null;
export type WebpackConfig = import('webpack').Configuration;

export type ModifyConfigFunction = (
  config: Config,
  platformOptions?: PlatformOptions
) => Config;

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

export interface CracoPluginOptions {
  [key: string]: any;
}

export interface CracoPlugin {
  overrideCracoConfig?: Function;
  overrideDevServerConfig?: Function;
  overrideJestConfig?: Function;
  overrideWebpackConfig?: Function;
}

export interface CracoPluginSettings {
  plugin: CracoPlugin;
  options?: CracoPluginOptions;
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
  plugins?: CracoPluginSettings[];
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
  _platform: CalculatedPlatform;
  _plugins: CalculatedPlugins;
  _state: ConfigState;
  babel?: CracoBabel;
  basePort: number;
  craco: CracoConfig;
  cracoPlugins?: CracoPluginSettings[];
  debug: boolean;
  devServer?: CracoDevServer;
  eslint?: CracoEslint;
  jest?: CracoJest;
  paths: Paths;
  platformName: string;
  platforms: Partial<PlatformsOptions>;
  plugins: Partial<PluginsOptions>;
  ports: Ports;
  reactScriptsVersion?: string;
  style?: CracoStyle;
  typescript?: CracoTypeScript;
  webpack?: CracoWebpack;
}
