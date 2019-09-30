import { Config, CONFIG_STATE } from './types';

export default {
  basePort: 6001,
  paths: {
    build: '{platform}/build',
    dist: 'dist/{_platform}',
    platform: '{tmp}/{_platform}',
    tmp: '.tmp'
  },
  ports: {},
  [CONFIG_STATE]: {
    setPaths: false,
    setPorts: false
  }
} as Partial<Config>;
