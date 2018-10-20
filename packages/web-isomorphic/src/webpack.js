import _ from 'lodash';
import AssetsWebpackPlugin from 'assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import mergeConfiguration from 'merge-configuration';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import {
  HotModuleReplacementPlugin,
  IgnorePlugin,
  NamedModulesPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';

function createWebpackConfig(config, webpackConfig) {
  const { action, babel, env, host, options, paths, ports, title } = config;
  webpackConfig = {
    ...webpackConfig,
    externals: {
      ...webpackConfig.externals,
      child_process: {},
      deasync: {},
      fs: {},
      winston: {}
    },
    entry: {
      client: [path.resolve(paths.platform, 'client.js')]
    },
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ..._.get(webpackConfig, 'resolve.alias', {}),
        'webpack/hot/poll': require.resolve('webpack/hot/poll')
      }
    },
    target: 'web',
    plugins: [
      ...(webpackConfig.plugins || []),
      new AssetsWebpackPlugin({
        path: paths.dist,
        filename: 'assets.json'
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(paths.src, 'public'),
          to: path.resolve(paths.dist, 'public')
        }
      ]),
      new IgnorePlugin(/^child_process$/),
      new IgnorePlugin(/^deasync$/),
      new IgnorePlugin(/^fs$/),
      new IgnorePlugin(/^winston$/),
      new HtmlWebpackPlugin({
        title,
        minify: true,
        template: path.resolve(paths.platform, 'index.html')
      }),
      ...(env !== 'production' ? [new NamedModulesPlugin()] : []),
      ...(action === 'start'
        ? [new HotModuleReplacementPlugin(), new NoEmitOnErrorsPlugin()]
        : [])
    ],
    module: {
      ...webpackConfig.module,
      strictExportPresence: true,
      rules: [
        ..._.get(webpackConfig, 'module.rules', []),
        {
          test: /\.(js|jsx|mjs)$/,
          include: [paths.src, paths.platform],
          loader: require.resolve('babel-loader'),
          options: babel
        }
      ]
    }
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
  }
  if (action === 'start') {
    webpackConfig = {
      ...webpackConfig,
      entry: {
        ...webpackConfig.entry,
        client: [
          ...webpackConfig.entry.client,
          require.resolve('./hotDevClient')
        ]
      },
      devServer: {
        before(app) {
          app.use(errorOverlayMiddleware());
        },
        contentBase: paths.distWebPublic,
        compress: true,
        disableHostCheck: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: { disableDotRule: true },
        host,
        hot: true,
        noInfo: !options.debug,
        overlay: false,
        port: ports.dev,
        quiet: !options.debug,
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
  webpackConfig = mergeConfiguration(webpackConfig, config.webpack, {}, config);
  return webpackConfig;
}

export { createWebpackConfig };
export default { createWebpackConfig };
