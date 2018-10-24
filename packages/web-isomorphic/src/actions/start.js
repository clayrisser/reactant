import CircularJSON from 'circular-json';
import WebpackDevServer from 'webpack-dev-server';
import easycp from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import webpack from 'webpack';
import { createWebpackConfig } from '../webpack';

export default async function start(config, { spinner, log, webpackConfig }) {
  const { paths, options, ports, action, platform } = config;
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
    return null;
  }
  const webpackClientConfig = createWebpackConfig(
    config,
    webpackConfig,
    'client'
  );
  if (options.debug) {
    fs.mkdirsSync(paths.debug);
    fs.writeFileSync(
      path.resolve(paths.debug, 'webpack.client.json'),
      CircularJSON.stringify(webpackClientConfig, null, 2)
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
      CircularJSON.stringify(webpackServerConfig, null, 2)
    );
  }
  log.debug('webpackServerConfig', webpackServerConfig);
  process.noDeprecation = true;
  fs.mkdirsSync(path.resolve(paths.src, 'public'));
  fs.mkdirsSync(paths.dist);
  fs.copySync(
    path.resolve(__dirname, '../public'),
    path.resolve(paths.dist, 'public')
  );
  fs.copySync(
    path.resolve(paths.src, 'public'),
    path.resolve(paths.dist, 'public')
  );
  fs.writeJsonSync(path.resolve(paths.dist, 'assets.json'), {});
  spinner.stop();
  return new Promise(resolve => {
    spinner = ora('compiling client').start();
    const serverCompiler = webpack(webpackServerConfig);
    const clientCompiler = webpack(webpackClientConfig);
    let started = false;
    clientCompiler.plugin('done', () => {
      if (!started) {
        spinner.succeed('compiled client');
        spinner = ora('compiling server').start();
      } else {
        ora('recompiled').succeed();
      }
      serverCompiler.watch(
        {
          quiet: true,
          stats: 'none'
        },
        () => {
          if (!started) {
            started = true;
            spinner.succeed('compiled server');
            spinner = ora(`started ${action} ${platform}`).succeed();
          }
          resolve();
        }
      );
    });
    const server = new WebpackDevServer(
      clientCompiler,
      webpackClientConfig.devServer
    );
    server.listen(ports.dev, webpackClientConfig.devServer.host, err => {
      if (err) {
        spinner.stop();
        log.error(err);
        resolve();
      }
    });
  });
}
