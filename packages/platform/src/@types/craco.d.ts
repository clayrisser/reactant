declare module '@craco/craco' {
  import {
    TransformOptions as BabelOptions,
    PluginItem as BabelPlugin
  } from '@babel/core';
  import {
    Rule as WebpackRule,
    Loader as WebpackLoader,
    Configuration as WebpackConfig
  } from 'webpack';

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
  export interface ConfigError {
    message: string;
    githubRepo: string;
    githubIssueQuery: string;
  }
  export interface Modes {
    extends: string;
    file: string;
  }
  export type Matcher = (f: any) => any;
  export function loaderByName(
    targetLoaderName: string
  ): (rule: WebpackRule) => any;
  export function getLoader(
    webpackConfig: WebpackConfig,
    matcher: Matcher
  ): {
    isFound: boolean;
    match: WebpackLoader;
  };
  export function getLoaders(
    webpackConfig: WebpackConfig,
    matcher: Matcher
  ): {
    hasFoundAny: boolean;
    matches: WebpackLoader[];
  };
  export function removeLoaders(
    webpackConfig: WebpackConfig,
    matcher: Matcher
  ): {
    hasRemovedAny: boolean;
    removedCount: number;
  };
  export function addBeforeLoader(
    webpackConfig: WebpackConfig,
    matcher: Matcher,
    newLoader: WebpackLoader
  ): {
    isAdded: boolean;
  };
  export function addAfterLoader(
    webpackConfig: WebpackConfig,
    matcher: Matcher,
    newLoader: WebpackLoader
  ): {
    isAdded: boolean;
  };
  export function addBeforeLoaders(
    webpackConfig: WebpackConfig,
    matcher: Matcher,
    newLoader: WebpackLoader
  ): {
    isAdded: boolean;
    addedCount: number;
  };
  export function addAfterLoaders(
    webpackConfig: WebpackConfig,
    matcher: Matcher,
    newLoader: WebpackLoader
  ): {
    isAdded: boolean;
    addedCount: number;
  };
  export function when<Value = any>(
    condition: boolean,
    fct: () => Value,
    unmet: Value
  ): Value;
  export function whenDev<Value = any>(fct: () => Value, unmet: Value): Value;
  export function whenProd<Value = any>(fct: () => Value, unmet: Value): Value;
  export function whenTest<Value = any>(fct: () => Value, unmet: Value): Value;
  export function throwUnexpectedConfigError(configError: ConfigError): void;
  export function gitHubIssueUrl(repo: string, query: string): string;
  export function createJestConfig(
    cracoConfig: CracoConfig,
    context?: object
  ): JestConfig;
  export function createWebpackDevConfig(
    cracoConfig: CracoConfig,
    context?: object
  ): WebpackConfig;
  export function createWebpackProdConfig(
    cracoConfig: CracoConfig,
    context?: object
  ): WebpackConfig;
  export type ESLINT_MODES = Modes;
  export type POSTCSS_MODES = Modes;
}
