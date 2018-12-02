import CircularJSON from 'circular-json';
import FileSizeReporter from 'react-dev-utils/FileSizeReporter';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import { log } from '@reactant/core';
import { createWebpackConfig, handleStats } from '../webpack';

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild
} = FileSizeReporter;

export default async function build(config, { spinner, webpackConfig }) {
  const { paths, options } = config;
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
  if (fs.existsSync(path.resolve(paths.src, 'public'))) {
    fs.copySync(
      path.resolve(paths.src, 'public'),
      path.resolve(paths.dist, 'public'),
      {
        dereference: true
      }
    );
  } else {
    fs.mkdirsSync(path.resolve(paths.dist, 'public'));
  }
  const { stats, previousFileSizes, warnings } = await runBuild(
    config,
    webpackServerConfig,
    webpackClientConfig,
    await measureFileSizesBeforeBuild(path.resolve(paths.dist, 'public'))
  );
  if (warnings.length) {
    spinner.warn('built web');
    log.info(warnings.join('\n\n'));
  } else {
    spinner.succeed('built web');
  }
  log.info('file sizes after gzip:\n');
  printFileSizesAfterBuild(stats, previousFileSizes, paths.dist);
  log.info('');
  return spinner.succeed();
}

async function runBuild(
  config,
  webpackServerConfig,
  webpackClientConfig,
  previousFileSizes
) {
  process.noDeprecation = true;
  const webStats = await compile(webpackClientConfig);
  const webMessages = handleStats(webStats, config);
  const nodeStats = await compile(webpackServerConfig);
  const nodeMessages = handleStats(nodeStats, config);
  return {
    errors: _.assign({}, webMessages.errors, nodeMessages.errors),
    previousFileSizes,
    stats: webStats,
    warnings: _.assign({}, webMessages.warnings, nodeMessages.warnings)
  };
}

async function compile(config) {
  return new Promise((resolve, reject) => {
    try {
      return webpack(config).run((err, stats) => {
        if (err) return reject(err);
        return resolve(stats);
      });
    } catch (err) {
      return reject(err);
    }
  });
}
