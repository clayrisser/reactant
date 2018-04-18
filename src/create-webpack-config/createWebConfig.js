import AssetsWebpackPlugin from 'assets-webpack-plugin';
import _ from 'lodash';
import UglifyWebpackPlugin from 'uglifyjs-webpack-plugin';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import path from 'path';
import {
  DefinePlugin,
  HotModuleReplacementPlugin,
  NamedModulesPlugin
} from 'webpack';

export default function createWebConfig(webpackConfig, action, config) {
  const { paths, host, port, envs, environment } = config;
  webpackConfig = _.merge(webpackConfig, {
    entry: {
      client: paths.client
    },
    externals: {
      'reaction/config': JSON.stringify(config)
    },
    plugins: [
      new NamedModulesPlugin(),
      new AssetsWebpackPlugin({
        path: paths.dist,
        filename: 'assets.json'
      }),
      new DefinePlugin({
        ...envs
      })
    ]
  });
  if (environment === 'development') {
    webpackConfig = _.merge(webpackConfig, {
      output: {
        path: paths.distPublic,
        publicPath: `http://${host}:${port}/`,
        pathinfo: true,
        filename: 'scripts/bundle.js',
        chunkFilename: 'scripts/[name].chunk.js',
        devtoolModuleFilenameTemplate: info => {
          return path.resolve(info.resourcePath).replace(/\\/g, '/');
        }
      },
      devServer:
        action === 'start'
          ? {
              disableHostCheck: true,
              compress: true,
              headers: {
                'Access-Control-Allow-Origin': '*'
              },
              historyApiFallback: {
                disableDotRule: true
              },
              host,
              hot: true,
              noInfo: true,
              overlay: false,
              port,
              quiet: true,
              watchOptions: {
                ignored: /node_modules/
              },
              setup(app) {
                app.use(errorOverlayMiddleware());
              }
            }
          : undefined,
      plugins: [...webpackConfig.plugins, new HotModuleReplacementPlugin()]
    });
  } else {
    webpackConfig = _.merge(webpackConfig, {
      output: {
        path: paths.distPublic,
        publicPath: '/',
        filename: 'scripts/bundle.[chunkhash:8].js',
        chunkFilename: 'scripts/[name].[chunkhash:8].chunk.js'
      },
      plugins: [
        ...webpackConfig.plugins,
        new UglifyWebpackPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              comparisons: false
            },
            output: {
              comments: false
            }
          },
          sourceMap: true
        })
      ]
    });
  }
  return webpackConfig;
}
