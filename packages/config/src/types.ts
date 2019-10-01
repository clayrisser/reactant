import { BaseConfig } from '@ecosystem/config';
import { Paths } from './paths';
import { Ports } from './ports';

export interface ConfigState {
  [key: string]: any;
  initialized?: boolean;
  ready?: boolean;
  setPaths?: boolean;
  setPorts?: boolean;
}

export interface Config extends BaseConfig {
  [key: string]: any;
  _state: ConfigState;
  basePort: number;
  paths: Paths;
  platform: string;
  ports: Ports;
}
