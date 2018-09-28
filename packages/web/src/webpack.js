import AssetsWebpackPlugin from 'assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import {
  HotModuleReplacementPlugin,
  IgnorePlugin,
  NamedModulesPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import getRules from '@reactant/cli/lib/webpack/getRules';

function createWebpackConfig(config, webpackConfig) {
  const { paths, env, action, babel, host, ports } = config;
  webpackConfig = {
    ...webpackConfig,
    entry: {
      client: [paths.client]
    },
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ...webpackConfig.resolve.alias,
        'webpack/hot/poll': require.resolve('webpack/hot/poll')
      }
    },
    externals: {
      ...webpackConfig.externals,
      'react-art': {}
    },
    target: 'web',
    devtool:
      env === 'development'
        ? 'cheap-module-eval-source-map'
        : 'nosources-source-map',
    plugins: [
      ...webpackConfig.plugins,
      new AssetsWebpackPlugin({
        path: paths.distWeb,
        filename: 'assets.json'
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(paths.root, 'web/index.html'),
          to: paths.webPublic
        }
      ]),
      new IgnorePlugin(/^child_process$/),
      new IgnorePlugin(/^deasync$/),
      new IgnorePlugin(/^fs$/),
      new IgnorePlugin(/^winston$/),
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
      devServer: {
        contentBase: paths.distWebPublic,
        before: app => {
          app.get('/some/path', (req, res) => {
            res.json({ custom: 'response' });
          });
        }
      },
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
  return webpackConfig;
}

export { createWebpackConfig };
export default { createWebpackConfig };
