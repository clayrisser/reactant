import FileSizeReporter from 'react-dev-utils/FileSizeReporter';
import _ from 'lodash';
import chalk from 'chalk';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import fs from 'fs-extra';
import ora from 'ora';
import webpack from 'webpack';
import clean from '../clean';
import createConfig from '../../createConfig';
import createWebpackConfig from '../../create-webpack-config';
import log from '../../log';

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild
} = FileSizeReporter;
const { env } = process;

export default async function buildWeb(options, config) {
  if (!config) {
    config = await createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  await clean(options, config);
  const spinner = ora('building web').start();
  const { paths } = config;
  if (fs.existsSync(paths.srcPublic)) {
    fs.copySync(paths.srcPublic, paths.distPublic, {
      dereference: true
    });
  } else {
    fs.mkdirsSync(paths.distPublic);
  }
  const { stats, previousFileSizes, warnings } = await runBuild(
    config,
    await measureFileSizesBeforeBuild(paths.distPublic)
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
}

async function runBuild(config, previousFileSizes) {
  const webpackWebConfig = createWebpackConfig('web', 'build', config);
  log.debug('webpackWebConfig', webpackWebConfig);
  const webpackNodeConfig = createWebpackConfig('node', 'build', config);
  log.debug('webpackNodeConfig', webpackNodeConfig);
  process.noDeprecation = true;
  const webSpinner = ora('compiling web').start();
  const webStats = await compile(webpackWebConfig);
  const webMessages = handleStats(webStats);
  webSpinner.succeed('compiled web');
  const serverSpinner = ora('compiling server').start();
  const nodeStats = await compile(webpackNodeConfig);
  const nodeMessages = handleStats(nodeStats);
  serverSpinner.succeed('compiled server');
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
    'webpack performance recommendations',
    './node_modules/colors/lib/colors.js',
    './node_modules/parse5/lib/index.js',
    './node_modules/express/lib/view.js'
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
