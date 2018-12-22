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
    ignore: {
      ...config.ignore,
      warnings: [
        ...(config?.ignore?.warnings || []),
        '/(express\\/lib\\/view)|(colors\\/lib\\/colors)|(bindings\\/bindings)|' +
          '(deasync\\/index)|(parse5\\/lib\\/index)|(ejs\\/lib\\/ejs)\\.js.*' +
          '(Critical dependency: the request of a dependency is an expression)|' +
          '(require\\.extensions is not supported by webpack\\. Use a loader instead\\.)/'
      ]
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
