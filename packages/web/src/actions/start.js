import CircularJSON from 'circular-json';
import WebpackDevServer, { addDevServerEntrypoints } from 'webpack-dev-server';
import easycp from 'easycp';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import { createWebpackConfig } from '../webpack';

export default async function start(config, { spinner, log, webpackConfig }) {
  const { paths, options, ports } = config;
  if (options.storybook) {
    fs.mkdirsSync(paths.storybook);
    fs.copySync(path.resolve(__dirname, '../storybook'), paths.storybook);
    spinner.stop();
    await easycp(
      `node ${require.resolve('@storybook/react/bin')} -p ${
        config.ports.storybook
      } -c ${paths.storybook}${options.debug ? ' -- --debug' : ''}${
        options.verbose ? ' -- --verbose' : ''
      }`
    );
  } else {
    webpackConfig = createWebpackConfig(config, webpackConfig);
    if (options.debug) {
      fs.mkdirsSync(paths.debug);
      fs.writeFileSync(
        path.resolve(paths.debug, 'webpack.client.json'),
        CircularJSON.stringify(webpackConfig, null, 2)
      );
    }
    log.debug('webpackConfig', webpackConfig);
    fs.mkdirsSync(path.resolve(paths.src, 'public'));
    fs.mkdirsSync(paths.dist);
    fs.writeJsonSync(path.resolve(paths.dist, 'assets.json'), {});
    addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(ports.dev, webpackConfig.devServer.host, () => {
      spinner.stop();
      log.info(`listening on port ${ports.dev}`);
    });
  }
}
