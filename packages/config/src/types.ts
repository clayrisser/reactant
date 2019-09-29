import { BaseConfig } from '@ecosystem/config';
import { Paths } from './paths';
import { Ports } from './ports';

export const CONFIG_STATE = Symbol('CONFIG_STATE');

export interface ConfigState {
  setPaths: boolean;
  setPorts: boolean;
  [key: string]: any;
}

export interface Config extends BaseConfig {
  [CONFIG_STATE]: ConfigState;
  [key: string]: any;
  basePort: number;
  paths: Paths;
  ports: Ports;
}
