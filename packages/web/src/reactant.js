import { build, clean, configure, start } from './actions';
import webpack from './webpack';

export default {
  webpack,
  actions: {
    build,
    clean,
    configure,
    start: {
      run: start,
      dependsOn: ['configure']
    }
  }
};
