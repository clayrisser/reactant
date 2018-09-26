import DevServer from 'webpack-dev-server';
import easycp from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import webpack from 'webpack';
import { log } from '@reactant/base';
import configureWeb from '../configure/web';
import createWebpackConfig from '../../webpack/createWebpackConfig';
import { loadConfig } from '../../config';

export default async function startWeb(options) {
  const config = loadConfig({
    action: 'start',
    defaultEnv: 'development',
    options
  });
  await configureWeb(options);
  const spinner = ora('starting web').start();
  const { paths } = config;
  if (options.storybook) {
    fs.copySync(
      path.resolve(__dirname, '../../storybook'),
      path.resolve(config.paths.root, '.storybook')
    );
    spinner.stop();
    const storybookBinPath = require.resolve('@storybook/react/bin');
    await easycp(
      `node ${storybookBinPath} -p ${config.ports.storybook} -c ${path.resolve(
        config.paths.root,
        '.storybook/web'
      )}${options.debug ? ' -- --debug' : ''}${
        options.verbose ? ' -- --verbose' : ''
      }`
    );
  } else {
    fs.mkdirsSync(paths.distWeb);
    fs.writeJsonSync(path.resolve(paths.distWeb, 'assets.json'), {});
    const webpackClientConfig = createWebpackConfig(config, {}, 'client');
    log.debug('webpackClientConfig', webpackClientConfig);
    const webpackServerConfig = createWebpackConfig(config, {}, 'server');
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
