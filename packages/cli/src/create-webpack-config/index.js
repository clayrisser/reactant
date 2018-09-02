import CircularJSON from 'circular-json';
import _ from 'lodash';
import path from 'path';
import {
  DefinePlugin,
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import createNodeConfig from './createNodeConfig';
import createWebConfig from './createWebConfig';
import getRules from './getRules';
import { sanitizeConfig } from '../createConfig';

export default function createWebpackConfig(target = 'web', action, config) {
  const { envs, paths, eslint, babel, env, webpack } = config;
  const sanitizedConfig = sanitizeConfig(config);
  let webpackConfig = {
    context: process.cwd(),
    target,
    devtool:
      env === 'development'
        ? 'cheap-module-eval-source-map'
        : 'nosources-source-map',
    mode: env,
    resolve: {
      modules: [path.resolve('node_modules')],
      extensions: ['.web.js', '.js', '.json', '.jsx', '.mjs'],
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
    webpackConfig = createWebConfig(webpackConfig, action, config);
  } else {
    webpackConfig = createNodeConfig(webpackConfig, action, config);
  }
  if (_.isFunction(webpack)) {
    return webpack(config, webpackConfig);
  }
  return _.merge(webpackConfig, webpack);
}
