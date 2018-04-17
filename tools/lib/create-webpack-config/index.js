import path from 'path';
import createNodeConfig from './createNodeConfig';
import createWebConfig from './createWebConfig';

export default function createWebpackConfig(target = 'web', action, config) {
  const {
    envs,
    host,
    port,
    paths,
    eslint,
    babel,
    environment,
    webpack
  } = config;
  const webpackConfig = {
    context: paths.src,
    target,
    devtool: 'cheap-module-eval-source-map',
    resolve: {
      modules: [path.resolve('node_modules')],
      extensions: ['.js', '.json', '.jsx', '.mjs'],
      alias: {
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        'react-native': require.resolve('react-native-web'),
        '~': paths.src
      }
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('eslint-loader'),
          options: eslint,
          include: paths.src,
          enforce: 'pre'
        },
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('babel-loader'),
          options: babel,
          include: paths.src
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'public/media/[name].[hash:8].[ext]'
          }
        },
        {
          exclude: [
            /\.html$/,
            /\.(js|jsx|mjs)$/,
            /\.(ts|tsx)$/,
            /\.(vue)$/,
            /\.(less)$/,
            /\.(re)$/,
            /\.(s?css|sass)$/,
            /\.json$/,
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/
          ],
          loader: require.resolve('file-loader'),
          options: {
            name: 'public/media/[name].[hash:8].[ext]'
          }
        }
      ]
    }
  };
  if (target === 'web') {
    return webpack(config, createWebConfig(webpackConfig, action, config));
  }
  return webpack(config, createNodeConfig(webpackConfig, action, config));
}
