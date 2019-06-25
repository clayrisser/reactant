import CircularJSON from 'circular-json';
import _ from 'lodash';
import path from 'path';
import pkgDir from 'pkg-dir';
import { DefinePlugin } from 'webpack';
import { getLinkedPaths } from 'linked-deps';
import getRules from './getRules';

const rootPath = pkgDir.sync(process.cwd());

export default function createWebpackConfig(
  config,
  { platform, webpackConfig = {} }
) {
  const { paths, env, envs, platformName } = config;
  return {
    ...webpackConfig,
    mode: env,
    context: pkgDir.sync(process.cwd()),
    devtool:
      env === 'development' ? 'inline-source-map' : 'nosources-source-map',
    resolve: {
      ...(webpackConfig.resolve || {}),
      modules: [...(webpackConfig?.resolve?.modules || []), ...getModules()],
      symlinks: false,
      extensions: _.uniq([
        ...(webpackConfig?.resolve?.extensions || []),
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
        ...(webpackConfig?.resolve?.alias || {}),
        '~': path.resolve(rootPath, paths.src)
      }
    },
    externals: {
      ...(webpackConfig.externals || {}),
      '@reactant/core/config': CircularJSON.stringify(config)
    },
    module: {
      ...(webpackConfig.module || {}),
      rules: [
        ...(webpackConfig?.module?.rules || []),
        ...getRules(config, { platform })
      ]
    },
    plugins: [
      ...(webpackConfig.plugins || []),
      new DefinePlugin({
        ...envs
      })
    ]
  };
}

function getModules() {
  const pkgPath = path.resolve(rootPath, 'package.json');
  return _.map(
    [path.resolve(rootPath), ...getLinkedPaths(pkgPath)],
    dependancyPath => {
      return path.join(dependancyPath, 'node_modules');
    }
  );
}
