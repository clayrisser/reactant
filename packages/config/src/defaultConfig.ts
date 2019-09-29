import { Config, CONFIG_STATE } from './types';

export default {
  basePort: 6001,
  paths: {},
  ports: {},
  [CONFIG_STATE]: {
    setPaths: false,
    setPorts: false
  }
} as Partial<Config>;
