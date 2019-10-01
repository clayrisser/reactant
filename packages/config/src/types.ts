import { BaseConfig } from '@ecosystem/config';
import {
  TransformOptions as BabelOptions,
  PluginItem as BabelPlugin
} from '@babel/core';
import { Configuration as WebpackConfig } from 'webpack';
import { Paths } from './paths';
import { Ports } from './ports';

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
export type Function = (...args: any[]) => any;
export type CracoDevServer = WebpackConfig | Function;
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
  devServer?: CracoDevServer;
  eslint?: CracoEslint;
  jest?: CracoJest;
  paths: Paths;
  platform: string;
  cracoPlugins?: CracoPlugin[];
  ports: Ports;
  reactScriptsVersion?: string;
  style?: CracoStyle;
  typescript?: CracoTypeScript;
  webpack?: CracoWebpack;
}
