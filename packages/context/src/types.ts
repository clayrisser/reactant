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
  state: { [key: string]: any };
}

export type SyncContextCallback = (
  context: Context
) => Context | Promise<Context>;
