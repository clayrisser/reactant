import { PlatformOptions } from '@reactant/platform';

const defaultOptions: Partial<PlatformOptions> = {
  docker: {
    image: null,
    packages: []
  },
  envs: {}
};

export default defaultOptions;
