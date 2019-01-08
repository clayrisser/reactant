import AssetsWebpackPlugin from 'assets-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import UglifyWebpackPlugin from 'uglifyjs-webpack-plugin';
import _ from 'lodash';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import path from 'path';
import pkgDir from 'pkg-dir';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { IgnorePlugin } from 'webpack';

const rootPath = pkgDir.sync(process.cwd());

export default function createClientConfig(
  config,
  { platform, webpackConfig }
) {
  const {
    action,
    env,
    host,
    offline,
    options,
    paths,
    platformName,
    ports
  } = config;
  webpackConfig = {
    ...webpackConfig,
    entry: {
      client: [path.resolve(rootPath, paths.platform, 'client.js')]
    },
    externals: {
      ...webpackConfig.externals,
      child_process: '{}',
      deasync: '{}',
      fs: '{}',
      winston: '{}'
    },
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ...(webpackConfig?.resolve?.alias || {}),
        '@reactant/web-isomorphic/ClientRoot': path.resolve(
          rootPath,
          paths.platform,
          'ClientRoot.js'
        )
      },
      extensions: _.uniq([
        `.${platform.properties.name}.client.js`,
        `.${platform.properties.name}.client.json`,
        `.${platform.properties.name}.client.jsx`,
        `.${platform.properties.name}.client.mjs`,
        `.${platformName}.client.js`,
        `.${platformName}.client.json`,
        `.${platformName}.client.jsx`,
        `.${platformName}.client.mjs`,
        ...(webpackConfig?.resolve?.extensions || [])
      ])
    },
    plugins: [
      ...webpackConfig.plugins,
      new AssetsWebpackPlugin({
        path: path.resolve(rootPath, paths.dist),
        filename: 'assets.json'
      }),
      new IgnorePlugin(/^child_process$/),
      new IgnorePlugin(/^deasync$/),
      new IgnorePlugin(/^fs$/),
      new IgnorePlugin(/^winston$/)
    ]
  };
  if (env === 'development') {
    webpackConfig = {
      ...webpackConfig,
      output: {
        path: path.resolve(rootPath, paths.dist, 'public'),
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
                comparisons: false,
                drop_console: true
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
        path: path.resolve(rootPath, paths.dist, 'public'),
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
        noInfo: !options.debug,
        overlay: false,
        port: ports.dev,
        quiet: false,
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
          analyzerPort: ports.analyzer,
          analyzerMode: 'static'
        })
      ]
    };
  }
  if (offline) {
    webpackConfig = {
      ...webpackConfig,
      plugins: [
        ...webpackConfig.plugins,
        new OfflinePlugin({
          publicPath: path.resolve(rootPath, paths.dist, 'public')
        })
      ]
    };
  } else {
    webpackConfig = {
      ...webpackConfig,
      plugins: [
        ...webpackConfig.plugins,
        new IgnorePlugin(/^offline-plugin\/runtime/)
      ]
    };
  }
  return webpackConfig;
}
