import { Config } from '@reactant/config';
import { Platform } from '@reactant/platform';
import { Plugins } from '@reactant/plugin';

export interface Context {
  config: Config;
  platform: Platform;
  platformName: string;
  plugins: Plugins;
}
