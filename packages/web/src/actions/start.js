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
    const storybookPath = path.resolve(paths.root, 'storybook');
    if (
      fs.existsSync(storybookPath) &&
      fs.lstatSync(storybookPath).isDirectory()
    ) {
      fs.copySync(storybookPath, paths.storybook);
    }
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
    log.write('webpackConfig', webpackConfig);
    fs.mkdirsSync(path.resolve(paths.dist, 'public'));
    fs.copySync(
      path.resolve(__dirname, '../public'),
      path.resolve(paths.dist, 'public')
    );
    fs.copySync(
      path.resolve(paths.src, 'public'),
      path.resolve(paths.dist, 'public')
    );
    addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(ports.dev, webpackConfig.devServer.host, () => {
      spinner.stop();
      log.info(`listening on port ${ports.dev}`);
    });
  }
}
