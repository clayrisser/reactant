import CircularJSON from 'circular-json';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import { getLinkedPaths } from 'linked-deps';
import {
  DefinePlugin,
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import createClientConfig from './createClientConfig';
import createServerConfig from './createServerConfig';
import getRules from './getRules';
import { sanitizeConfig } from '../createConfig';

export default function createWebConfig(config, webpackConfig, target = 'web') {
  const { envs, paths, eslint, babel, env, action } = config;
  const sanitizedConfig = sanitizeConfig(config);
  if (target === 'client') target = 'web';
  if (target === 'server') target = 'node';
  webpackConfig = {
    ...webpackConfig,
    context: process.cwd(),
    target,
    devtool:
      env === 'development'
        ? 'cheap-module-eval-source-map'
        : 'nosources-source-map',
    mode: env,
    resolve: {
      extensions: ['.web.js', '.js', '.json', '.jsx', '.mjs'],
      modules: getModules(),
      symlinks: true,
      alias: {
        '~': paths.src,
        'react-native': require.resolve('react-native-web'),
        'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': require.resolve(
          'react-native-web/dist/modules/ReactNativePropRegistry'
        ),
        'webpack/hot/poll': require.resolve('webpack/hot/poll')
      }
    },
    externals: {
      '@reactant/base/config': CircularJSON.stringify(sanitizedConfig)
    },
    module: {
      strictExportPresence: true,
      rules: [
        ...getRules({ paths, env }),
        {
          test: /\.(js|jsx|mjs)$/,
          include: [paths.android, paths.ios, paths.src, paths.web],
          loader: require.resolve('eslint-loader'),
          options: eslint,
          enforce: 'pre'
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: [
            paths.src,
            paths.web,
            path.resolve('node_modules/native-base-shoutem-theme'),
            path.resolve('node_modules/react-native-drawer'),
            path.resolve('node_modules/react-native-easy-grid'),
            path.resolve(
              'node_modules/react-native-keyboard-aware-scroll-view'
            ),
            path.resolve('node_modules/react-native-safe-area-view'),
            path.resolve('node_modules/react-native-tab-view'),
            path.resolve('node_modules/react-native-vector-icons'),
            path.resolve('node_modules/react-native-web'),
            path.resolve('node_modules/@reactant/base'),
            path.resolve('node_modules/static-container')
          ],
          loader: require.resolve('babel-loader'),
          options: babel
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        ...envs
      }),
      ...(env !== 'production' ? [new NamedModulesPlugin()] : []),
      ...(action === 'start'
        ? [new HotModuleReplacementPlugin(), new NoEmitOnErrorsPlugin()]
        : [])
    ]
  };
  if (target === 'web') {
    return createClientConfig(config, webpackConfig);
  }
  return createServerConfig(config, webpackConfig);
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