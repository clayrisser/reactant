import { PlatformOptions, PlatformsOptions } from './platform';
import { PluginsOptions } from './plugin';

export type WebpackConfig = any;

export type WebpackConfigModifier = (
  webpackConfig: WebpackConfig
) => WebpackConfig;

export type BabelConfig = any;

export type BabelConfigModifier = (babelConfig: BabelConfig) => BabelConfig;

export type GlobalConfig = {
  [key: string]: any;
};

export interface Config {
  babel?: BabelConfigModifier | BabelConfig;
  global: GlobalConfig;
  platform: PlatformOptions;
  platforms: PlatformsOptions;
  plugins: PluginsOptions;
  webpack?: WebpackConfigModifier | WebpackConfig;
}
