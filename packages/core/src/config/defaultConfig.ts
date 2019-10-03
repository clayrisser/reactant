import { Config } from '../types';

export default {
  basePort: 6001,
  debug: false,
  paths: {
    build: '{tmp}/build',
    dist: 'dist/{_platform}',
    tmp: '.tmp/reactant/{_platform}/{_action}'
  },
  ports: {},
  _state: {
    initialized: false,
    ready: false,
    setPaths: false,
    setPorts: false
  }
} as Partial<Config>;
