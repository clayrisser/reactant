import { PlatformOptions, PlatformsOptions } from './platform';
import { PluginsOptions } from './plugin';

export interface Envs {
  [key: string]: string | null;
}

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
  envs: Envs;
  global: GlobalConfig;
  platform: PlatformOptions;
  platforms: PlatformsOptions;
  plugins: PluginsOptions;
  preferredPackageManager: string;
  webpack?: WebpackConfigModifier | WebpackConfig;
}
