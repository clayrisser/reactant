import AssetsWebpackPlugin from 'assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import {
  HotModuleReplacementPlugin,
  IgnorePlugin,
  NamedModulesPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import getRules from '@reactant/cli/lib/webpack/getRules';

function createWebpackConfig(config, webpackConfig) {
  const {
    action,
    babel,
    env,
    host,
    options,
    paths,
    platform,
    ports,
    title
  } = config;
  webpackConfig = {
    ...webpackConfig,
    entry: {
      client: [path.resolve(paths.root, 'web/client.js')]
    },
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ...webpackConfig.resolve.alias,
        'webpack/hot/poll': require.resolve('webpack/hot/poll')
      }
    },
    target: 'web',
    plugins: [
      ...webpackConfig.plugins,
      new AssetsWebpackPlugin({
        path: paths.distWeb,
        filename: 'assets.json'
      }),
      new CopyWebpackPlugin([
        {
          from: paths.srcPublic,
          to: paths.webPublic
        }
      ]),
      new IgnorePlugin(/^child_process$/),
      new IgnorePlugin(/^deasync$/),
      new IgnorePlugin(/^fs$/),
      new IgnorePlugin(/^winston$/),
      new HtmlWebpackPlugin({
        title,
        minify: true,
        template: path.resolve(paths.root, platform, 'index.html')
      }),
      ...(env !== 'production' ? [new NamedModulesPlugin()] : []),
      ...(action === 'start'
        ? [new HotModuleReplacementPlugin(), new NoEmitOnErrorsPlugin()]
        : [])
    ],
    module: {
      strictExportPresence: true,
      rules: [
        ...(webpackConfig.rules || []),
        ...getRules({ paths, env }),
        {
          test: /\.(js|jsx|mjs)$/,
          include: [paths.src, paths.web],
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
        client: [
          ...webpackConfig.entry.client,
          require.resolve('@reactant/cli/lib/hotDevClient')
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
  return webpackConfig;
}

export { createWebpackConfig };
export default { createWebpackConfig };
