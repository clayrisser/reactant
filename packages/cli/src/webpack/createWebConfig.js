import path from 'path';
import {
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import createClientConfig from './createClientConfig';
import createServerConfig from './createServerConfig';
import getRules from './getRules';

export default function createWebConfig(config, webpackConfig, target = 'web') {
  const { paths, eslint, babel, env, action } = config;
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
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ...webpackConfig.resolve.alias,
        'react-native': require.resolve('react-native-web'),
        'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': require.resolve(
          'react-native-web/dist/modules/ReactNativePropRegistry'
        ),
        'webpack/hot/poll': require.resolve('webpack/hot/poll')
      }
    },
    module: {
      strictExportPresence: true,
      rules: [
        ...(webpackConfig.rules || []),
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
      ...webpackConfig.plugins,
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
