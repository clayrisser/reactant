import CircularJSON from 'circular-json';
import _ from 'lodash';
import path from 'path';
import { DefinePlugin } from 'webpack';
import { getLinkedPaths } from 'linked-deps';
import { sanitizeConfig } from '../config';

export default function createWebpackConfig(config, webpackConfig, target) {
  const { webpack, options, paths, env, envs } = config;
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
  switch (options.platform) {
    case 'ios':
      webpackConfig = {
        ...webpackConfig,
        ...require('./createIosConfig').default(config, webpackConfig)
      };
      break;
    case 'android':
      webpackConfig = {
        ...webpackConfig,
        ...require('./createAndroidConfig').default(config, webpackConfig)
      };
      break;
    case 'web':
      webpackConfig = {
        ...webpackConfig,
        ...require('./createWebConfig').default(config, webpackConfig, target)
      };
      break;
  }
  if (_.isFunction(webpack)) {
    return webpack(config, webpackConfig);
  }
  return _.merge(webpackConfig, webpack);
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
