import WebpackDevServer, { addDevServerEntrypoints } from 'webpack-dev-server';
import easycp from 'easycp';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import { createWebpackConfig } from '../webpack';

export default async function start(config, { spinner, log, webpackConfig }) {
  const { paths, options, ports, platform } = config;
  if (options.storybook) {
    fs.mkdirsSync(paths.reactant);
    fs.copySync(
      path.resolve(path.resolve('../storybook')),
      path.resolve(paths.storybook)
    );
    spinner.stop();
    await easycp(
      `node ${require.resolve('@storybook/react/bin')} -p ${
        config.ports.storybook
      } -c ${path.resolve(paths.storybook, 'web')}${
        options.debug ? ' -- --debug' : ''
      }${options.verbose ? ' -- --verbose' : ''}`
    );
  } else {
    webpackConfig = createWebpackConfig(config, webpackConfig);
    log.debug('webpackConfig', webpackConfig);
    fs.mkdirsSync(path.resolve(paths.src, 'public'));
    fs.mkdirsSync(path.resolve(paths.dist, platform));
    fs.writeJsonSync(path.resolve(paths.dist, platform, 'assets.json'), {});
    addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(ports.dev, webpackConfig.devServer.host, () => {
      spinner.stop();
      log.info(`listening on port ${ports.dev}`);
    });
  }
}
