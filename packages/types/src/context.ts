import { Config } from './config';
import { LoadedPlatform } from './platform';
import { LoadedPlugins } from './plugin';

export interface Envs {
  [key: string]: string | null;
}

export interface Options {
  analyze?: boolean;
  args: string[];
  config: Partial<Config>;
  debug: boolean;
  docker?: boolean;
}

export interface Context {
  action: string;
  config?: Config;
  debug: boolean;
  envs: Envs;
  logLevel: string | number;
  options: Options;
  paths: Paths;
  platform?: LoadedPlatform;
  platformName: string;
  plugins: LoadedPlugins;
  state: { [key: string]: any };
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
