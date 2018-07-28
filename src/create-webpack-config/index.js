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
import { sanitizeConfig } from '../createConfig';

export default function createWebpackConfig(target = 'web', action, config) {
  const { envs, paths, eslint, babel, env, webpack } = config;
  const sanitizedConfig = sanitizeConfig(config);
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
        'react-native': require.resolve('react-native-web'),
        'webpack/hot/poll': require.resolve('webpack/hot/poll')
      }
    },
    externals: {
      'reaction-base/config': CircularJSON.stringify(sanitizedConfig)
    },
    module: {
      strictExportPresence: true,
      rules: [
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
            path.resolve('node_modules/reaction-base'),
            path.resolve('node_modules/static-container')
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
          test: /\.s?css$/,
          use: [
            'isomorphic-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: path.resolve(__dirname, 'postcss.config.js')
                }
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
