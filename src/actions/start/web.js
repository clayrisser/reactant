import DevServer from 'webpack-dev-server';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import log from '../../log';
import createConfig from '../../createConfig';
import createWebpackConfig from '../../create-webpack-config';

const { env } = process;

export default async function startWeb(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'development' });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: START WEB :::');
  if (options.inspectBrk) env.INSPECT_BRK_ENABLED = true;
  if (options.inspect) env.INSPECT_ENABLED = true;
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
