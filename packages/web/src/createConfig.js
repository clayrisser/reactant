import _ from 'lodash';
import resolve from '@reactant/core/resolve';

const storybook =
  _.includes(process.argv, '-s') || _.includes(process.argv, '--storybook');

export default function(config) {
  return {
    ...config,
    babel: {
      ...config.babel,
      plugins: _.uniq([
        resolve('react-hot-loader/babel', __dirname),
        ...(config?.babel?.plugins || [])
      ])
    },
    ports: {
      ...config.ports,
      storybook: null
    },
    paths: {
      ...config.paths,
      stories: 'stories',
      storybook: '{reactant}/storybook'
    },
    webpack: {},
    ...(storybook ? { storybook: {} } : {})
  };
}
