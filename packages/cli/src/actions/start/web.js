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
    const storiesPath = fs.existsSync(
      path.resolve(config.paths.stories, '.storybook')
    )
      ? path.resolve(config.paths.stories, '.storybook')
      : path.resolve('node_modules/@reactant/cli/lib/storybook/web');
    spinner.stop();
    await easycp(
      `node node_modules/@storybook/react/bin -p ${
        config.ports.storybook
      } -c ${storiesPath}${options.debug ? ' -- --debug' : ''}${
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
