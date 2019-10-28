import { Config } from './config';
import { Context } from './context';
import { Logger } from './core';

export interface PlatformApi {}

export type PlatformOption = any;

export interface PlatformOptions {
  [key: string]: PlatformOption;
}

export type Action = (
  context?: Context,
  logger?: Logger,
  platformApi?: PlatformApi
) => any;

export interface Actions {
  [key: string]: Action;
}

export interface Platform {
  actions: Actions;
  config: ModifyPlatformConfigFunction;
  defaultOptions: Partial<PlatformOptions>;
  name: string;
}

export type ModifyPlatformConfigFunction = (
  config: Config,
  platformOptions?: PlatformOptions
) => Config;
