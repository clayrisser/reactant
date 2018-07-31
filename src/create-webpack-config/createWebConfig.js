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
        path: paths.distWeb,
        filename: 'assets.json'
      })
    ]
  };
  if (env === 'development') {
    webpackConfig = {
      ...webpackConfig,
      output: {
        path: paths.distWebPublic,
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
        concatenateModules: true,
        flagIncludedChunks: true,
        mangleWasmImports: true,
        mergeDuplicateChunks: true,
        minimize: true,
        occurrenceOrder: true,
        providedExports: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        sideEffects: true,
        minimizer: [
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
        ],
        splitChunks: {
          chunks: 'all'
        }
      },
      output: {
        path: paths.distWebPublic,
        publicPath: '/',
        filename: 'scripts/bundle.[hash:8].js',
        chunkFilename: 'scripts/[name].[hash:8].chunk.js'
      }
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
