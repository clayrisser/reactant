import open from 'open';
import WebpackDevServer from 'webpack-dev-server';
import easycp from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import webpack from 'webpack';
import { createWebpackConfig, handleStats } from '../webpack';

export default async function start(config, { spinner, log, webpackConfig }) {
  const { paths, options, ports, action, platform, port } = config;
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
    return null;
  }
  process.noDeprecation = true;
  const webpackClientConfig = createWebpackConfig(
    config,
    webpackConfig,
    'client'
  );
  log.write('webpackClientConfig', webpackClientConfig);
  const webpackServerConfig = createWebpackConfig(
    config,
    webpackConfig,
    'server'
  );
  log.write('webpackServerConfig', webpackServerConfig);
  fs.mkdirsSync(path.resolve(paths.dist, 'public'));
  fs.copySync(
    path.resolve(__dirname, '../public'),
    path.resolve(paths.dist, 'public')
  );
  fs.copySync(
    path.resolve(paths.src, 'public'),
    path.resolve(paths.dist, 'public')
  );
  spinner.stop();
  spinner = ora('compiling client').start();
  const serverCompiler = webpack(webpackServerConfig);
  const clientCompiler = webpack(webpackClientConfig);
  const server = new WebpackDevServer(
    clientCompiler,
    webpackClientConfig.devServer
  );
  let started = false;
  await new Promise(resolve => {
    clientCompiler.plugin('done', () => {
      if (!started) {
        spinner.succeed('compiled client');
        spinner = ora('compiling server').start();
        return resolve();
      }
      return ora('recompiled').succeed();
    });
  });
  await new Promise(resolve => {
    serverCompiler.watch({ quiet: true, stats: 'none' }, (err, stats) => {
      const { errors, warnings } = handleStats(stats, config);
      if (errors.length) {
        spinner.fail('failed to compile server');
      } else if (!started) {
        started = true;
        spinner[warnings.length ? 'warn' : 'succeed']('compiled server');
        spinner = ora(`started ${action} ${platform}`).succeed();
      }
      return resolve();
    });
  });
  await new Promise((resolve, reject) => {
    server.listen(ports.dev, webpackClientConfig.devServer.host, err => {
      if (err) {
        spinner.stop();
        return reject(err);
      }
      return resolve();
    });
  });
  await new Promise(r => setTimeout(r, 3000));
  return open(`http://localhost:${port}`);
}
