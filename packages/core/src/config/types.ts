import { Paths } from './paths';
import Ports from './ports';

export interface ConfigState {
  setPorts: boolean;
  [key: string]: any;
}

export interface Config {
  _state: ConfigState;
  basePort: number;
  paths: Paths;
  ports: Ports;
  [key: string]: any;
}
