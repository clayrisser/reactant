import { build, clean, publish, start } from './actions';
import createConfig from './createConfig';

export default {
  config: createConfig,
  actions: {
    build: {
      run: build,
      dependsOn: ['clean']
    },
    clean,
    publish: {
      run: publish,
      dependsOn: ['build']
    },
    start
  }
};
