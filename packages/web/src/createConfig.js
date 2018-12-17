import _ from 'lodash';
import path from 'path';
import pkgDir from 'pkg-dir';

const storybook =
  _.includes(process.argv, '-s') || _.includes(process.argv, '--storybook');

export default function(config) {
  return {
    ...config,
    babel: {
      ...config.babel,
      plugins: [resolve('react-hot-loader/babel'), ...config.babel.plugins]
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

function resolve(packageName) {
  return require.resolve(packageName, {
    paths: [path.resolve(pkgDir.sync(process.cwd()), 'node_modules')]
  });
}
