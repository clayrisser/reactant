import AssetsWebpackPlugin from 'assets-webpack-plugin';
import {
  HotModuleReplacementPlugin,
  IgnorePlugin,
  NamedModulesPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import getRules from '@reactant/cli/lib/webpack/getRules';

function createWebpackConfig(config, webpackConfig) {
  const { paths, env, action, babel } = config;
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
  return webpackConfig;
}

export { createWebpackConfig };
export default { createWebpackConfig };
