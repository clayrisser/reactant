export interface Platform {
  config: (config?: Config) => Config;
}

export interface Envs {
  [key: string]: string | number | boolean | undefined;
}

export interface Config {
  action?: string;
  babel?: object;
  env?: string;
  envs?: Envs;
  eslint?: object;
  host?: string;
  moduleName?: string;
  options?: Options;
  platform?: Platform;
  port?: number;
  title?: string;
}

export interface Options {
  [key: string]: Option;
}

export type Option = string | boolean | number;
