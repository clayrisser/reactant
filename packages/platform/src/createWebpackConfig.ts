import config from '@reactant/config';

export default function createWebpackConfig() {
  // eslint-disable-next-line no-undef
  return config?.webpack || {};
}
