import { Platform } from '@reactant/platform';
import { Plugins } from '@reactant/plugin';

// TODO
export type Config = any;

export interface Options {}

export interface Context {
  config: Config;
  options: Options;
  platform: Platform;
  platformName: string;
  plugins: Plugins;
}

export type SyncContextCallback = (
  context: Context
) => Context | Promise<Context>;
