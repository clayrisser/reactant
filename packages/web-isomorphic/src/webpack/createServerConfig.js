import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import StartServerPlugin from 'start-server-webpack-plugin';
import _ from 'lodash';
import path from 'path';
import webpack from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';

const { LimitChunkCountPlugin } = webpack.optimize;

export default function createServerConfig(config, webpackConfig) {
  const {
    paths,
    host,
    ports,
    options,
    action,
    platform,
    platformType
  } = config;
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
        ..._.get(webpackConfig, 'resolve.alias'),
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
        `.${platform}.server.js`,
        `.${platform}.server.jsx`,
        `.${platform}.server.mjs`,
        `.${platform}.server.json`,
        `.${platformType}.server.js`,
        `.${platformType}.server.jsx`,
        `.${platformType}.server.mjs`,
        `.${platformType}.server.json`,
        ..._.get(webpackConfig, 'resolve.extensions', [])
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
        }),
        new OpenBrowserPlugin({ url: `http://localhost:${config.port}` })
      ]
    };
  }
  return webpackConfig;
}
