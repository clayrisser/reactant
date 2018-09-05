import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import { getLinkedPaths } from 'linked-deps';

export default function createWebpackConfig(config, target) {
  const { webpack, options, paths } = config;
  let webpackConfig = {
    resolve: {
      modules: getModules(),
      extensions: ['.web.js', '.js', '.json', '.jsx', '.mjs'],
      symlinks: false,
      alias: {
        '~': paths.src
      }
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
  let modulePaths = [fs.realpathSync(path.resolve(__dirname, '../../..'))];
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
