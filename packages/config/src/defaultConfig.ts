import { Config } from './types';

export default {
  basePort: 6001,
  paths: {},
  ports: {},
  _state: {
    setPaths: false,
    setPorts: false
  }
} as Partial<Config>;
