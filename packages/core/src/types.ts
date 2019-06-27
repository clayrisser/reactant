export interface Platform {
  config: (config?: Config) => Partial<Config>;
}

export interface Envs {
  [key: string]: string | number | boolean | undefined;
}

export interface Ports {
  [key: string]: number | boolean | null;
}

export interface Config {
  action?: string;
  babel: object;
  env: string;
  envs: Envs;
  eslint: object;
  host: string;
  moduleName: string;
  options: Options;
  platform: Platform;
  port: number;
  ports: Ports;
  title: string;
}

export interface Options {
  [key: string]: Option;
}

export type Option = string | boolean | number;
