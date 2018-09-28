import { build, clean, configure, start } from './actions';

export default {
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
