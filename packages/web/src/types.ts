import { Configuration as WebpackConfig } from 'webpack';

type BabelOptions = import('@babel/core').TransformOptions;
type BabelPlugin = import('@babel/core').PluginItem;

export type CracoDevServer = WebpackConfig | Function;

export type Function = (...args: any[]) => any;

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
