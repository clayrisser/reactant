import { BaseConfig } from '@ecosystem/config';
import { Paths } from './paths';
import Ports from './ports';

export interface ConfigState {
  setPaths: boolean;
  setPorts: boolean;
  [key: string]: any;
}

export interface Config extends BaseConfig {
  _state: ConfigState;
  basePort: number;
  paths: Paths;
  ports: Ports;
  [key: string]: any;
}
