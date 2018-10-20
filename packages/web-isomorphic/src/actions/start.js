import CircularJSON from 'circular-json';
import WebpackDevServer from 'webpack-dev-server';
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
    const webpackClientConfig = createWebpackConfig(
      config,
      webpackConfig,
      'client'
    );
    if (options.debug) {
      fs.mkdirsSync(paths.debug);
      fs.writeFileSync(
        path.resolve(paths.debug, 'webpack.client.json'),
        CircularJSON.stringify(webpackConfig, null, 2)
      );
    }
    log.debug('webpackClientConfig', webpackClientConfig);
    const webpackServerConfig = createWebpackConfig(
      config,
      webpackConfig,
      'server'
    );
    if (options.debug) {
      fs.mkdirsSync(paths.debug);
      fs.writeFileSync(
        path.resolve(paths.debug, 'webpack.server.json'),
        CircularJSON.stringify(webpackConfig, null, 2)
      );
    }
    log.debug('webpackServerConfig', webpackServerConfig);
    process.noDeprecation = true;
    fs.mkdirsSync(path.resolve(paths.src, 'public'));
    fs.mkdirsSync(paths.dist);
    fs.writeJsonSync(path.resolve(paths.dist, 'assets.json'), {});
    webpack(webpackServerConfig).watch(
      {
        quiet: true,
        stats: 'none'
      },
      err => {
        if (err) log.error(err);
        spinner.stop();
      }
    );
    const clientCompiler = webpack(webpackClientConfig);
    const server = new WebpackDevServer(
      clientCompiler,
      webpackClientConfig.devServer
    );
    server.listen(ports.dev, webpackClientConfig.devServer.host, () => {
      spinner.stop();
      log.info(`listening on port ${ports.dev}`);
    });
  }
}
