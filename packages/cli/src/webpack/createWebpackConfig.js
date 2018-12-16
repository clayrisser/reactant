import CircularJSON from 'circular-json';
import _ from 'lodash';
import path from 'path';
import pkgDir from 'pkg-dir';
import { DefinePlugin } from 'webpack';
import { getLinkedPaths } from 'linked-deps';
import getRules from './getRules';

export default function createWebpackConfig(config, { platform }) {
  const { paths, env, envs, platformName } = config;
  return {
    mode: env,
    context: pkgDir.sync(process.cwd()),
    devtool:
      env === 'development'
        ? 'cheap-module-eval-source-map'
        : 'nosources-source-map',
    resolve: {
      modules: getModules(config),
      symlinks: false,
      extensions: _.uniq([
        `.${platformName}.js`,
        `.${platformName}.jsx`,
        `.${platformName}.mjs`,
        `.${platformName}.json`,
        `.${platform.properties.type}.js`,
        `.${platform.properties.type}.jsx`,
        `.${platform.properties.type}.mjs`,
        `.${platform.properties.type}.json`,
        '.js',
        '.jsx',
        '.mjs',
        '.json'
      ]),
      alias: {
        '~': paths.src
      }
    },
    externals: {
      '@reactant/core/config': CircularJSON.stringify(config)
    },
    module: {
      rules: getRules(config, { platform })
    },
    plugins: [
      new DefinePlugin({
        ...envs
      })
    ]
  };
}

function getModules(config) {
  const { paths } = config;
  const pkgPath = path.resolve(paths.root, 'package.json');
  return _.map(
    [path.resolve(paths.root), ...getLinkedPaths(pkgPath)],
    dependancyPath => {
      return path.join(dependancyPath, 'node_modules');
    }
  );
}
