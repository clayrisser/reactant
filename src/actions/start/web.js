import DevServer from 'webpack-dev-server';
import easycp from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import webpack from 'webpack';
import { log } from 'reaction-base';
import createConfig from '../../createConfig';
import createWebpackConfig from '../../create-webpack-config';
import configureWeb from '../configure/web';

export default async function startWeb(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'start',
      defaultEnv: 'development',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await configureWeb(options, config);
  const spinner = ora('starting web').start();
  const { paths } = config;
  if (options.storybook) {
    const storiesPath = fs.existsSync(
      path.resolve(config.paths.stories, '.storybook')
    )
      ? path.resolve(config.paths.stories, '.storybook')
      : path.resolve('node_modules/reaction-build/lib/storybook/web');
    spinner.stop();
    await easycp(
      `node node_modules/@storybook/react/bin -p ${
        config.ports.storybook
      } -c ${storiesPath}${options.debug ? ' -- --debug' : ''}${
        options.verbose ? ' -- --verbose' : ''
      }`
    );
  } else {
    fs.removeSync(path.resolve(paths.distWeb, 'assets.json'));
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
        spinner.stop();
      }
    );
    const webStats = webpack(webpackWebConfig);
    const clientDevServer = new DevServer(webStats, webpackWebConfig.devServer);
    clientDevServer.listen(config.ports.dev, 'localhost', err => {
      if (err) log.error(err);
    });
  }
}
