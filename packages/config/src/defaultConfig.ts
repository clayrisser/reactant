import { Config } from './types';

export default {
  basePort: 6001,
  paths: {
    build: '{platform}/build',
    dist: 'dist/{_platform}',
    platform: '{tmp}/{_platform}',
    tmp: '.tmp'
  },
  ports: {},
  _state: {
    initialized: false,
    ready: false,
    setPaths: false,
    setPorts: false
  }
} as Partial<Config>;
