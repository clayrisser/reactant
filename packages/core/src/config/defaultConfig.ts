import { Config } from './types';

export default {
  _state: {
    setPorts: false
  },
  basePort: 6001,
  ports: {}
} as Partial<Config>;
