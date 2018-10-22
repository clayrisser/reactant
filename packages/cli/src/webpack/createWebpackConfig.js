import CircularJSON from 'circular-json';
import _ from 'lodash';
import path from 'path';
import pkgDir from 'pkg-dir';
import { DefinePlugin } from 'webpack';
import { getLinkedPaths } from 'linked-deps';
import getRules from './getRules';
import { sanitizeConfig } from '../config';

export default function createWebpackConfig(config, webpackConfig = {}) {
  const { paths, env, envs, platform, platformType } = config;
  const sanitizedConfig = sanitizeConfig(config);
  webpackConfig = {
    ...webpackConfig,
    mode: env,
    context: pkgDir.sync(process.cwd()),
    devtool:
      env === 'development'
        ? 'cheap-module-eval-source-map'
        : 'nosources-source-map',
    resolve: {
      ...webpackConfig.resolve,
      modules: [...(webpackConfig.modules || []), ...getModules(config)],
      symlinks: false,
      extensions: _.uniq([
        ..._.get(webpackConfig, 'resolve.extensions', []),
        `.${platform}.js`,
        `.${platform}.jsx`,
        `.${platform}.mjs`,
        `.${platform}.json`,
        `.${platformType}.js`,
        `.${platformType}.jsx`,
        `.${platformType}.mjs`,
        `.${platformType}.json`,
        '.js',
        '.jsx',
        '.mjs',
        '.json'
      ]),
      alias: {
        ...webpackConfig.alias,
        '~': paths.src
      }
    },
    externals: {
      ...webpackConfig.externals,
      '@reactant/core/config': CircularJSON.stringify(sanitizedConfig)
    },
    module: {
      ...webpackConfig.module,
      rules: [..._.get(webpackConfig, 'module.rules', []), ...getRules(config)]
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
