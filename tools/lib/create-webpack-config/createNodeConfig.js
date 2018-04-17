import webpackNodeExternals from 'webpack-node-externals';
import webpack, {
  DefinePlugin,
  HotModuleReplacementPlugin,
  NamedModulesPlugin,
  StartServerPlugin
} from 'webpack';

const { LimitChunkCountPlugin } = webpack.optimize;
const { env } = process;

export default function createNodeConfig(
  webpackConfig,
  action,
  { envs, paths, host, port, environment }
) {
  webpackConfig = {
    ...webpackConfig,
    entry: [paths.server],
    output: {
      path: paths.dist,
      publicPath:
        environment === 'development' ? `http://${host}:${port}/` : '/',
      filename: 'server.js'
    },
    node: {
      console: true,
      __filename: true,
      __dirname: true
    },
    externals: webpackNodeExternals({
      whitelist: [
        ...[environment === 'development' ? 'webpack/hot/poll?300' : undefined],
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/
      ]
    }),
    plugins: [
      new NamedModulesPlugin(),
      new DefinePlugin({
        ...envs
      }),
      new LimitChunkCountPlugin({
        maxChunks: 1
      })
    ]
  };
  if (environment === 'development') {
    webpackConfig = {
      ...webpackConfig,
      watch: true,
      entry: [...webpackConfig.entry, 'webpack/hot/poll?300'],
      plugins: [
        ...webpackConfig.plugins,
        ...(action === 'start'
          ? [
              new HotModuleReplacementPlugin(),
              StartServerPlugin({
                name: 'server.js',
                nodeArgs: [
                  ...[env.INSPECT_BRK_ENABLED ? '--inspect-brk' : undefined],
                  ...[env.INSPECT_ENABLED ? '--inspect' : undefined]
                ]
              })
            ]
          : [])
      ]
    };
  }
  return webpackConfig;
}
