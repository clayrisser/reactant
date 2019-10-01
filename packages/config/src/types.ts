import { BaseConfig } from '@ecosystem/config';
import { Configuration as WebpackConfig } from 'webpack';
import { TransformOptions as BabelOptions } from '@babel/core';
import { Paths } from './paths';
import { Ports } from './ports';

export interface JestConfig {
  [key: string]: any;
}
export interface EslintOptions {
  [key: string]: any;
}
export interface TypeScriptOptions {
  [key: string]: any;
}

export interface CracoConfig {
  babel?: BabelOptions;
  eslint?: EslintOptions;
  typescript?: TypeScriptOptions;
  webpack?: WebpackConfig;
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
  basePort: number;
  craco: CracoConfig;
  paths: Paths;
  platform: string;
  ports: Ports;
}
