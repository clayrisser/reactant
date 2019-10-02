import { Config } from '../types';

export default {
  basePort: 6001,
  debug: false,
  paths: {
    build: '{tmp}/build/{_platform}',
    dist: 'dist/{_platform}',
    tmp: '.tmp/reactant'
  },
  ports: {},
  _state: {
    initialized: false,
    ready: false,
    setPaths: false,
    setPorts: false
  }
} as Partial<Config>;
