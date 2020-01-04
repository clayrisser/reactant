import getConfig from '@reactant/config';

export default function createBabelConfig() {
  // eslint-disable-next-line no-undef
  return getConfig()?.babel || {};
}
