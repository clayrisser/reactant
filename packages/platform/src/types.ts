import { Config } from '@reactant/config';
import PlatformApi from './platformApi';

// TODO
export type Context = any;

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
  config: Config | ModifyPlatformConfigFunction;
  defaultOptions: Partial<PlatformOptions>;
  name: string;
}

export type ModifyPlatformConfigFunction = (
  config: Config,
  platformOptions?: PlatformOptions
) => Config;

export interface Logger {
  debug(message?: any, ...optionalParams: any[]): any;
  silly(message?: any, ...optionalParams: any[]): any;
  error(message?: any, ...optionalParams: any[]): any;
  info(message?: any, ...optionalParams: any[]): any;
  spinner: Spinner;
  warn(message?: any, ...optionalParams: any[]): any;
}

export interface Spinner {
  fail(message?: string): Spinner;
  info(message?: string): Spinner;
  start(message?: string): Spinner;
  stop(): any;
  succeed(message?: string): Spinner;
  warn(message?: string): Spinner;
}
