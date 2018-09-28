import DevServer from 'webpack-dev-server';
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
    const webStats = webpack(webpackConfig);
    const clientDevServer = new DevServer(webStats, webpackConfig.devServer);
    clientDevServer.listen(ports.dev, 'localhost', err => {
      if (err) log.error(err);
      spinner.stop();
      log.info(`listening on port ${ports.dev}`);
    });
  }
  // const { options, paths } = config;
  // if (options.storybook) {
  //   fs.mkdirsSync(paths.reactant);
  //   fs.copySync(
  //     path.resolve(pkgDir.sync(require.resolve('@reactant/storybook')), 'lib'),
  //     path.resolve(paths.storybook)
  //   );
  //   spinner.stop();
  //   await easycp(
  //     `node ${require.resolve('@storybook/react/bin')} -p ${
  //       config.ports.storybook
  //     } -c ${path.resolve(paths.storybook, 'web')}${
  //       options.debug ? ' -- --debug' : ''
  //     }${options.verbose ? ' -- --verbose' : ''}`
  //   );
  // } else {
  //   fs.mkdirsSync(paths.distWeb);
  //   fs.writeJsonSync(path.resolve(paths.distWeb, 'assets.json'), {});
  //   const webpackClientConfig = createWebpackConfig('client');
  //   log.debug('webpackClientConfig', webpackClientConfig);
  //   const webpackServerConfig = createWebpackConfig('server');
  //   log.debug('webpackServerConfig', webpackServerConfig);
  //   process.noDeprecation = true;
  //   webpack(webpackServerConfig).watch(
  //     {
  //       quiet: true,
  //       stats: 'none'
  //     },
  //     err => {
  //       if (err) log.error(err);
  //       spinner.stop();
  //     }
  //   );
  //   const webStats = webpack(webpackClientConfig);
  //   const clientDevServer = new DevServer(
  //     webStats,
  //     webpackClientConfig.devServer
  //   );
  //   clientDevServer.listen(config.ports.dev, 'localhost', err => {
  //     if (err) log.error(err);
  //   });
  // }
}
