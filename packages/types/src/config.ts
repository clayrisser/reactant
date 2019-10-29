import { PlatformOptions, PlatformsOptions } from './platform';
import { PluginsOptions } from './plugin';

export type WebpackConfig = any;

export type WebpackConfigModifier = (
  webpackConfig: WebpackConfig
) => WebpackConfig;

export type BabelConfig = any;

export type BabelConfigModifier = (babelConfig: BabelConfig) => BabelConfig;

export interface Config {
  babel?: BabelConfigModifier | BabelConfig;
  platform: PlatformOptions;
  platforms: PlatformsOptions;
  plugins: PluginsOptions;
  webpack?: WebpackConfigModifier | WebpackConfig;
}
