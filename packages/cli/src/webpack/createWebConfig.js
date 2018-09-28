import path from 'path';
import pkgDir from 'pkg-dir';
import {
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import createClientConfig from './createClientConfig';
import createServerConfig from './createServerConfig';
import getRules from './getRules';

export default function createWebConfig(config, webpackConfig, target = 'web') {
  const { paths, /* eslint, */ babel, env, action, platform } = config;
  process.env.NODE_ENV = env;
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
        // {
        //   test: /\.(js|jsx|mjs)$/,
        //   include: [paths.android, paths.ios, paths.src, paths.web],
        //   loader: require.resolve('eslint-loader'),
        //   options: eslint,
        //   enforce: 'pre'
        // },
        {
          test: /\.(js|jsx|mjs)$/,
          include: [
            paths.src,
            paths.web,
            ...(platform.web.native
              ? getModuleIncludes(
                  [
                    '@reactant/base',
                    'native-base',
                    'native-base-shoutem-theme',
                    'react-native-drawer',
                    'react-native-easy-grid',
                    'react-native-keyboard-aware-scroll-view',
                    'react-native-safe-area-view',
                    'react-native-tab-view',
                    'react-native-vector-icons',
                    'react-native-web',
                    'react-navigation',
                    'static-container'
                  ],
                  config
                )
              : [])
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

function getModuleIncludes(modules, config) {
  const { paths } = config;
  const includes = [];
  modules.forEach(module => {
    try {
      const modulePath = pkgDir.sync(
        require.resolve(path.resolve(paths.root, 'node_modules', module))
      );
      includes.push(modulePath);
    } catch (err) {}
  });
  return includes;
}
