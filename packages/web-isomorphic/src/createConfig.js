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
      plugins: [
        resolve('react-hot-loader/babel'),
        ...config.babel.plugins
      ]
    },
    ignore: {
      ...config.ignore,
      warnings: [
        ..._.get(config, 'ignore.warnings', []),
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

function resolve(packageName) {
  return require.resolve(packageName, {
    paths: [path.resolve(pkgDir.sync(process.cwd()), 'node_modules')]
  });
}
