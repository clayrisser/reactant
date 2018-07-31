import CircularJSON from 'circular-json';
import autoprefixer from 'autoprefixer';
import path from 'path';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import {
  DefinePlugin,
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import createNodeConfig from './createNodeConfig';
import createWebConfig from './createWebConfig';
import { sanitizeConfig } from '../createConfig';

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    ident: 'postcss',
    plugins: () => [
      postcssFlexbugsFixes,
      autoprefixer({
        browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
        flexbox: 'no-2009'
      })
    ]
  }
};

export default function createWebpackConfig(target = 'web', action, config) {
  const { envs, paths, eslint, babel, env, webpack } = config;
  const sanitizedConfig = sanitizeConfig(config);
  const webpackConfig = {
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
            name: 'media/[name].[hash:8].[ext]'
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
          // local styles
          test: /\.(s?css|sass)$/,
          exclude: [
            path.resolve(paths.root, 'node_modules'),
            path.resolve(paths.web, 'styles')
          ],
          loaders: [
            'isomorphic-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName:
                  env === 'development'
                    ? '[name]_[local]_[hash:base64:3]'
                    : '[hash:base64:4]',
                minimize: env !== 'development',
                sourceMap: env === 'development'
              }
            },
            postcssLoader,
            'sass-loader'
          ]
        },
        {
          // global styles
          test: /\.(s?css|sass)$/,
          include: [
            path.resolve(paths.root, 'node_modules'),
            path.resolve(paths.web, 'styles')
          ],
          loaders: [
            'isomorphic-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName: '[local]',
                minimize: env !== 'development',
                sourceMap: env === 'development'
              }
            },
            postcssLoader,
            'sass-loader'
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
