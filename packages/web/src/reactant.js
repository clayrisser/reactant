import { build, clean, configure, start } from './actions';
import createConfig from './createConfig';

export default {
  config: createConfig,
  actions: {
    build: {
      run: build,
      dependsOn: ['clean', 'configure']
    },
    clean,
    configure,
    start: {
      run: start,
      dependsOn: ['configure']
    }
  }
};
