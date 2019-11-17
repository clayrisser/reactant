import { Config } from './config';
import { LoadedPlatform } from './platform';
import { LoadedPlugins } from './plugin';

export interface Options {
  config: Partial<Config>;
  debug: boolean;
}

export interface Context {
  action: string;
  config?: Config;
  debug: boolean;
  logLevel: string | number;
  options: Options;
  paths: Paths;
  platform?: LoadedPlatform;
  platformName: string;
  plugins: LoadedPlugins;
  state: { [key: string]: any };
  userConfig: Partial<Config>;
}

export type SyncContextCallback = (
  context: Context
) => Context | Promise<Context>;

export type Path = string;

export interface Paths {
  build: Path;
  dist: Path;
  reactant: Path;
  root: Path;
  tmp: Path;
  [key: string]: Path;
}
