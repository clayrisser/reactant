import DevServer from 'webpack-dev-server';
import easycp from 'easycp';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import pkgDir from 'pkg-dir';

export default async function start(
  config,
  { spinner, log, createWebpackConfig }
) {
  const { options, paths } = config;
  if (options.storybook) {
    fs.mkdirsSync(paths.reactant);
    fs.copySync(
      path.resolve(pkgDir.sync(require.resolve('@reactant/storybook')), 'lib'),
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
    fs.mkdirsSync(paths.distWeb);
    fs.writeJsonSync(path.resolve(paths.distWeb, 'assets.json'), {});
    const webpackClientConfig = createWebpackConfig('client');
    log.debug('webpackClientConfig', webpackClientConfig);
    const webpackServerConfig = createWebpackConfig('server');
    log.debug('webpackServerConfig', webpackServerConfig);
    process.noDeprecation = true;
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
    const webStats = webpack(webpackClientConfig);
    const clientDevServer = new DevServer(
      webStats,
      webpackClientConfig.devServer
    );
    clientDevServer.listen(config.ports.dev, 'localhost', err => {
      if (err) log.error(err);
    });
  }
}
