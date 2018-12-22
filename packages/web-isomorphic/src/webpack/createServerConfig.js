import StartServerPlugin from 'start-server-webpack-plugin';
import _ from 'lodash';
import path from 'path';
import webpack from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';

const { LimitChunkCountPlugin } = webpack.optimize;

export default function createServerConfig(
  config,
  { platform, webpackConfig }
) {
  const { paths, host, ports, options, action, platformName } = config;
  webpackConfig = {
    ...webpackConfig,
    entry: [path.resolve(__dirname, '../server.js')],
    output: {
      path: paths.dist,
      publicPath: action === 'start' ? `http://${host}:${ports.dev}/` : '/',
      filename: 'server.js'
    },
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ...(webpackConfig?.resolve?.alias || {}),
        '@reactant/web-isomorphic/index.html': path.resolve(
          paths.platform,
          'index.html'
        ),
        '@reactant/web-isomorphic/server': path.resolve(
          paths.platform,
          'server.js'
        )
      },
      extensions: _.uniq([
        `.${platform.properties.name}.server.js`,
        `.${platform.properties.name}.server.json`,
        `.${platform.properties.name}.server.jsx`,
        `.${platform.properties.name}.server.mjs`,
        `.${platformName}.server.js`,
        `.${platformName}.server.json`,
        `.${platformName}.server.jsx`,
        `.${platformName}.server.mjs`,
        ...(webpackConfig?.resolve?.extensions || [])
      ])
    },
    node: {
      console: true,
      __filename: true,
      __dirname: true
    },
    externals: {
      ...webpackConfig.externals,
      ...webpackNodeExternals({
        whitelist: [
          ...(action === 'start' ? ['webpack/hot/poll?300'] : []),
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/
        ]
      }),
      '@reactant/core/assets': "require('./assets.json')"
    },
    plugins: [
      ...webpackConfig.plugins,
      new LimitChunkCountPlugin({
        maxChunks: 1
      })
    ]
  };
  if (action === 'start') {
    webpackConfig = {
      ...webpackConfig,
      watch: true,
      entry: [...webpackConfig.entry, 'webpack/hot/poll?300'],
      plugins: [
        ...webpackConfig.plugins,
        new StartServerPlugin({
          name: 'server.js',
          nodeArgs: [
            ...(options.inspect ? ['--inspect'] : []),
            ...(options.inspectBrk ? ['--inspect-brk'] : [])
          ],
          keyboard: true
        })
      ]
    };
  }
  return webpackConfig;
}
