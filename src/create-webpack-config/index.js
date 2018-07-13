import CircularJSON from 'circular-json';
import path from 'path';
import {
  DefinePlugin,
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import createNodeConfig from './createNodeConfig';
import createWebConfig from './createWebConfig';

export default function createWebpackConfig(target = 'web', action, config) {
  const { envs, paths, eslint, babel, env, webpack } = config;
  const webpackConfig = {
    context: process.cwd(),
    target,
    devtool: 'cheap-module-eval-source-map',
    mode: env,
    resolve: {
      modules: [path.resolve('node_modules')],
      extensions: ['.web.js', '.js', '.json', '.jsx', '.mjs'],
      alias: {
        '~': paths.src,
        'native-base': require.resolve('native-base-web'),
        'react-native': require.resolve('react-native-web'),
        'react/lib/ReactNativePropRegistry': require.resolve(
          'react-native-web/dist/modules/ReactNativePropRegistry'
        ),
        'webpack/hot/poll': require.resolve('webpack/hot/poll')
      }
    },
    externals: {
      'reaction-base/config': CircularJSON.stringify(config)
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          include: [
            paths.src,
            paths.web,
            path.resolve('node_modules/reaction-base')
          ],
          loader: require.resolve('eslint-loader'),
          options: eslint,
          enforce: 'pre'
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: [
            paths.src,
            paths.web,
            path.resolve('node_modules/reaction-base')
          ],
          loader: require.resolve('babel-loader'),
          options: babel
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          include: [
            paths.src,
            paths.web,
            path.resolve('node_modules/reaction-base')
          ],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'public/media/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.html?$/,
          include: [
            paths.src,
            paths.web,
            path.resolve('node_modules/reaction-base')
          ],
          loader: require.resolve('html-loader')
        },
        {
          test: /\.md$/,
          include: [
            paths.src,
            paths.web,
            path.resolve('node_modules/reaction-base')
          ],
          use: [
            {
              loader: require.resolve('html-loader')
            },
            {
              loader: require.resolve('markdown-loader'),
              options: {
                pedantic: true,
                gfm: true,
                breaks: true
              }
            }
          ]
        },
        {
          exclude: [
            /\.(js|jsx|mjs)$/,
            /\.(less)$/,
            /\.(re)$/,
            /\.(s?css|sass)$/,
            /\.(ts|tsx)$/,
            /\.(vue)$/,
            /\.bmp$/,
            /\.gif$/,
            /\.html?$/,
            /\.jpe?g$/,
            /\.json$/,
            /\.md$/,
            /\.png$/
          ],
          loader: require.resolve('file-loader'),
          options: {
            name: 'public/media/[name].[hash:8].[ext]'
          }
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
    return webpack(config, createWebConfig(webpackConfig, action, config));
  }
  return webpack(config, createNodeConfig(webpackConfig, action, config));
}
