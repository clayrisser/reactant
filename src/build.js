import FileSizeReporter from 'react-dev-utils/FileSizeReporter';
import _ from 'lodash';
import chalk from 'chalk';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import fs from 'fs-extra';
import webpack from 'webpack';
import clean from './clean';
import createConfig from './createConfig';
import createWebpackConfig from './create-webpack-config';
import log from './log';

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild
} = FileSizeReporter;
const { env } = process;

export default async function build() {
  const config = createConfig({ defaultEnv: 'production' });
  log.verbose('config', config);
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
  const webpackWebConfig = createWebpackConfig('web', 'build', config);
  log.verbose('webpackWebConfig', webpackWebConfig);
  const webpackNodeConfig = createWebpackConfig('node', 'build', config);
  log.verbose('webpackNodeConfig', webpackNodeConfig);
  process.noDeprecation = true;
  log.info('compiling web . . .');
  const webStats = await compile(webpackWebConfig);
  const webMessages = handleStats(webStats);
  log.info(chalk.green('compiled web successfully'));
  log.info('compiling server . . .');
  const nodeStats = await compile(webpackNodeConfig);
  const nodeMessages = handleStats(nodeStats);
  log.info(chalk.green('compiled server successfully'));
  return {
    stats: webStats,
    previousFileSizes,
    warnings: _.assign({}, webMessages.warnings, nodeMessages.warnings)
  };
}

function handleStats(stats) {
  const messages = formatWebpackMessages(stats.toJson({}, true));
  const errorIgnoreList = [];
  const errors = filterMessages(messages.errors, errorIgnoreList);
  if (errors.length) {
    throw new Error(`\n${errors.join('\n\n')}\n`);
  }
  const warningIgnoreList = [
    'asset size limit: The following asset(s) exceed the recommended size limit',
    'entrypoint size limit: The following entrypoint(s)' +
      ' combined asset size exceeds the recommended limit',
    'webpack performance recommendations'
  ];
  const warnings = filterMessages(messages.warnings, warningIgnoreList);
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

function filterMessages(messages, ignoreList) {
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
