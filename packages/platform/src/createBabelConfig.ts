import config from '@reactant/config';

export default function createBabelConfig() {
  // eslint-disable-next-line no-undef
  return config?.babel || {};
}
