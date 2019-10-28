import { Config } from './config';
import { Platform } from './platform';
import { Plugins } from './plugin';

export interface Options {}

export interface Context {
  config: Partial<Config>;
  options: Options;
  platform?: Platform;
  platformName: string;
  plugins: Plugins;
  state: { [key: string]: any };
  userConfig: Partial<Config>;
}

export type SyncContextCallback = (
  context: Context
) => Context | Promise<Context>;
