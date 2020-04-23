import { PlatformOptions } from '@reactant/platform';

const defaultOptions: Partial<PlatformOptions> = {
  docker: {
    buildPackages: [],
    image: null,
    packages: []
  },
  envs: {}
};

export default defaultOptions;
