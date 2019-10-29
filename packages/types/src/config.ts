import { PlatformOptions, PlatformsOptions } from './platform';
import { PluginsOptions } from './plugin';

export interface Config {
  platform: PlatformOptions;
  platforms: PlatformsOptions;
  plugins: PluginsOptions;
}
