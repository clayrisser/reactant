import CircularJSON from 'circular-json';
import FileSizeReporter from 'react-dev-utils/FileSizeReporter';
import _ from 'lodash';
import chalk from 'chalk';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import { log } from '@reactant/core';
import { createWebpackConfig } from '../webpack';

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild
} = FileSizeReporter;
const { env } = process;

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
    stats: webStats,
    previousFileSizes,
    warnings: _.assign({}, webMessages.warnings, nodeMessages.warnings)
  };
}

function handleStats(stats, config) {
  const messages = formatWebpackMessages(stats.toJson({}, true));
  const errors = filterMessages(
    messages.errors,
    config.ignore.errors || [],
    config.options
  );
  if (errors.length) {
    throw new Error(`\n${errors.join('\n\n')}\n`);
  }
  const warnings = filterMessages(
    messages.warnings,
    config.ignore.warnings || [],
    config.options
  );
  if (warnings.length) {
    if (env.CI && (!_.isString(env.CI) || env.CI.toLowerCase() !== 'false')) {
      log.info(
        chalk.yellow(
          '\ntreating warnings as errors because `CI = true`\n' +
            'most CI servers set it automatically'
        )
      );
      throw new Error(`\n${warnings.join('\n\n')}\n`);
    } else {
      log.info(`\n${warnings.join('\n\n')}\n`);
    }
  }
  return messages;
}

function filterMessages(messages, ignoreList, options) {
  if (options.debug) return messages;
  return _.filter(messages, message => {
    let filter = true;
    ignoreList.forEach(ignore => {
      if (
        (_.isRegExp(ignore) && ignore.test(message)) ||
        message.indexOf(ignore) > -1
      ) {
        filter = false;
        return false;
      }
      return true;
    });
    return filter;
  });
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
