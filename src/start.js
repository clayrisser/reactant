import DevServer from 'webpack-dev-server';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import createConfig from './createConfig';
import createWebpackConfig from './create-webpack-config';
import log from './log';

const { env } = process;

export default async function start(options) {
  if (options.inspectBrk) env.INSPECT_BRK_ENABLED = true;
  if (options.inspect) env.INSPECT_ENABLED = true;
  const config = createConfig({ defaultEnv: 'development' });
  log.debug('config', config);
  const { paths } = config;
  fs.removeSync(path.resolve(paths.dist, 'assets.json'));
  const webpackWebConfig = createWebpackConfig('web', 'start', config);
  log.debug('webpackWebConfig', webpackWebConfig);
  const webpackNodeConfig = createWebpackConfig('node', 'start', config);
  log.debug('webpackNodeConfig', webpackNodeConfig);
  process.noDeprecation = true;
  webpack(webpackNodeConfig).watch(
    {
      quiet: true,
      stats: 'none'
    },
    err => {
      if (err) log.error(err);
    }
  );
  const webStats = webpack(webpackWebConfig);
  const clientDevServer = new DevServer(webStats, webpackWebConfig.devServer);
  clientDevServer.listen(config.devPort, 'localhost', err => {
    if (err) log.error(err);
  });
}
