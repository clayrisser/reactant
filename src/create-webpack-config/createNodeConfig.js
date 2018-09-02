import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import StartServerPlugin from 'start-server-webpack-plugin';
import webpack from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';

const { LimitChunkCountPlugin } = webpack.optimize;

export default function createNodeConfig(webpackConfig, action, config) {
  const { paths, host, ports, options } = config;
  webpackConfig = {
    ...webpackConfig,
    entry: [paths.server],
    output: {
      path: paths.distWeb,
      publicPath: action === 'start' ? `http://${host}:${ports.dev}/` : '/',
      filename: 'server.js'
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
      'reaction-base/assets': "require('./assets.json')"
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
          ]
        }),
        new OpenBrowserPlugin({ url: `http://localhost:${config.port}` })
      ]
    };
  }
  return webpackConfig;
}
