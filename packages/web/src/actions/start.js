import WebpackDevServer, { addDevServerEntrypoints } from 'webpack-dev-server';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import { createWebpackConfig } from '../webpack';

export default async function start(config, { spinner, log, webpackConfig }) {
  const { paths, options, ports } = config;
  if (!options.storybook) {
    webpackConfig = createWebpackConfig(config, webpackConfig);
    log.debug('webpackConfig', webpackConfig);
    fs.mkdirsSync(paths.distWeb);
    fs.writeJsonSync(path.resolve(paths.distWeb, 'assets.json'), {});
    addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(ports.dev, webpackConfig.devServer.host, () => {
      spinner.stop();
      log.info(`listening on port ${ports.dev}`);
    });
  }
}
