import CircularJSON from 'circular-json';
import _ from 'lodash';
import path from 'path';
import { DefinePlugin } from 'webpack';
import { getLinkedPaths } from 'linked-deps';
import { sanitizeConfig } from '../config';

export default function createWebpackConfig(config, webpackConfig = {}) {
  const { paths, env, envs } = config;
  const sanitizedConfig = sanitizeConfig(config);
  webpackConfig = {
    ...webpackConfig,
    mode: env,
    resolve: {
      ...webpackConfig.resolve,
      modules: [...(webpackConfig.modules || []), ...getModules(config)],
      symlinks: false,
      extensions: ['.js', '.json', '.jsx', '.mjs'],
      alias: {
        ...webpackConfig.alias,
        '~': paths.src
      }
    },
    externals: {
      '@reactant/base/config': CircularJSON.stringify(sanitizedConfig)
    },
    plugins: [
      ...(webpackConfig.plugins || []),
      new DefinePlugin({
        ...envs
      })
    ]
  };
  return webpackConfig;
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
