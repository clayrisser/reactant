import AssetsWebpackPlugin from 'assets-webpack-plugin';
import UglifyWebpackPlugin from 'uglifyjs-webpack-plugin';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default function createWebConfig(webpackConfig, action, config) {
  const { ports, paths, host, env } = config;
  webpackConfig = {
    ...webpackConfig,
    entry: {
      client: [paths.client]
    },
    externals: {
      ...webpackConfig.externals,
      child_process: {},
      deasync: {},
      fs: {},
      winston: {}
    },
    plugins: [
      ...webpackConfig.plugins,
      new AssetsWebpackPlugin({
        path: paths.dist,
        filename: 'assets.json'
      })
    ]
  };
  if (env === 'development') {
    webpackConfig = {
      ...webpackConfig,
      output: {
        path: paths.distPublic,
        publicPath: action === 'start' ? `http://${host}:${ports.dev}/` : '/',
        pathinfo: true,
        filename: 'scripts/bundle.js',
        chunkFilename: 'scripts/[name].chunk.js',
        devtoolModuleFilenameTemplate: info => {
          return path.resolve(info.resourcePath).replace(/\\/g, '/');
        }
      }
    };
  } else {
    webpackConfig = {
      ...webpackConfig,
      optimization: {
        splitChunks: {
          chunks: 'all'
        }
      },
      output: {
        path: paths.distPublic,
        publicPath: '/',
        filename: 'scripts/bundle.[hash:8].js',
        chunkFilename: 'scripts/[name].[hash:8].chunk.js'
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
    };
  }
  if (action === 'start') {
    webpackConfig = {
      ...webpackConfig,
      entry: {
        client: [
          ...webpackConfig.entry.client,
          require.resolve('../hotDevClient')
        ]
      },
      devServer: {
        before(app) {
          app.use(errorOverlayMiddleware());
        },
        compress: true,
        disableHostCheck: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: { disableDotRule: true },
        host,
        hot: true,
        noInfo: true,
        overlay: false,
        port: ports.dev,
        quiet: true,
        watchOptions: { ignored: /node_modules/ }
      }
    };
  }
  if (config.options.analyze) {
    webpackConfig = {
      ...webpackConfig,
      plugins: [
        ...webpackConfig.plugins,
        new BundleAnalyzerPlugin({
          analyzerPort: ports.analyzer
        })
      ]
    };
  }
  return webpackConfig;
}
