import CircularJSON from 'circular-json';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import { getLinkedPaths } from 'linked-deps';
import { sanitizeConfig } from '../createConfig';

export default function createWebpackConfig(config, webpackConfig, target) {
  const { webpack, options, paths } = config;
  const sanitizedConfig = sanitizeConfig(config);
  webpackConfig = {
    ...webpackConfig,
    resolve: {
      ...webpackConfig.resolve,
      modules: [...(webpackConfig.modules || []), ...getModules()],
      symlinks: false,
      alias: {
        ...webpackConfig.alias,
        '~': paths.src
      }
    },
    externals: {
      '@reactant/base/config': CircularJSON.stringify(sanitizedConfig)
    }
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

function getModules() {
  let modulePaths = [fs.realpathSync(path.resolve(__dirname, '../../../..'))];
  const pkgPath = path.resolve(__dirname, '../../../../archetype/package.json');
  if (fs.existsSync(pkgPath)) {
    modulePaths = _.map(
      [
        path.resolve(__dirname, '../../../../archetype'),
        ...getLinkedPaths(pkgPath)
      ],
      dependancyPath => {
        return path.join(dependancyPath, 'node_modules');
      }
    );
  }
  return modulePaths;
}
