import FileSizeReporter from 'react-dev-utils/FileSizeReporter';
import _ from 'lodash';
import chalk from 'chalk';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import fs from 'fs-extra';
import webpack from 'webpack';
import createConfig from './createConfig';
import createWebpackConfig from './create-webpack-config';
import log from './log';
import clean from './clean';

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild
} = FileSizeReporter;
const { env } = process;

export default async function build() {
  const config = createConfig();
  log.info('config', config);
  const { paths } = config;
  await clean();
  fs.copySync(paths.srcPublic, paths.distPublic, {
    dereference: true
  });
  const { stats, previousFileSizes, warnings } = await runBuild(
    config,
    await measureFileSizesBeforeBuild(paths.distPublic)
  );
  if (warnings.length) {
    log.info(chalk.yellow('compiled with warnings\n'));
    log.info(warnings.join('\n\n'));
  } else {
    log.info(chalk.green('compiled successfully\n'));
  }
  log.info('file sizes after gzip:\n');
  printFileSizesAfterBuild(stats, previousFileSizes, paths.dist);
}

async function runBuild(config, previousFileSizes) {
  const webpackWebConfig = createWebpackConfig('web', config);
  const webpackNodeConfig = createWebpackConfig('node', config);
  process.noDeprecation = true;
  log.info('compiling web . . .');
  const webStats = await compile(webpackWebConfig);
  const webMessages = formatWebpackMessages(webStats.toJson({}, true));
  if (webMessages.errors.length) {
    throw new Error(webMessages.errors.join('\n\n'));
  }
  if (
    env.CI &&
    (!_.isString(env.CI) || env.CI.toLowerCase() !== 'false') &&
    webMessages.warnings.length
  ) {
    log.info(
      chalk.yellow(
        '\ntreating warnings as errors because `CI = true`\n' +
          'most CI servers set it automatically\n'
      )
    );
    throw new Error(webMessages.warnings.join('\n\n'));
  }
  log.info(chalk.green('compiled web'));
  log.info('compiling server . . .');
  const nodeStats = await compile(webpackNodeConfig);
  const nodeMessages = formatWebpackMessages(nodeStats.toJson({}, true));
  if (nodeMessages.errors.length) {
    throw new Error(nodeMessages.errors.join('\n\n'));
  }
  if (
    env.CI &&
    (!_.isString(env.CI) || env.CI.toLowerCase() !== 'false') &&
    nodeMessages.warnings.length
  ) {
    log.info(
      chalk.yellow(
        '\ntreating warnings as errors because `CI = true`\n' +
          'most CI servers set it automatically\n'
      )
    );
    throw new Error(nodeMessages.warnings.join('\n\n'));
  }
  log.info(chalk.green('compiled server successfully'));
  return {
    stats: webStats,
    previousFileSizes,
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
