import path from 'path';
import createNodeConfig from './createNodeConfig';
import createWebConfig from './createWebConfig';

export default function createWebpackConfig(
  target = 'web',
  environment = 'development',
  { envs, host, port, paths, eslintOptions, babelOptions }
) {
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
          options: eslintOptions,
          include: paths.src,
          enforce: 'pre'
        },
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('babel-loader'),
          options: babelOptions,
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
    return createWebConfig(webpackConfig, environment, {
      envs,
      host,
      port,
      paths
    });
  }
  return createNodeConfig(webpackConfig, environment, {
    envs,
    host,
    port,
    paths
  });
}
