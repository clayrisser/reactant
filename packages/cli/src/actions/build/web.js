import FileSizeReporter from 'react-dev-utils/FileSizeReporter';
import _ from 'lodash';
import chalk from 'chalk';
import easycp from 'easycp';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import webpack from 'webpack';
import { log } from 'reaction-base';
import configureWeb from '../configure/web';
import clean from '../clean';
import createConfig from '../../createConfig';
import createWebpackConfig from '../../create-webpack-config';

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild
} = FileSizeReporter;
const { env } = process;

export default async function buildWeb(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'build',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await clean(options, config);
  await configureWeb({ ...options, clean: false }, config);
  const spinner = ora('building web').start();
  const { paths } = config;
  if (options.storybook) {
    const storiesPath = fs.existsSync(
      path.resolve(config.paths.stories, '.storybook')
    )
      ? path.resolve(config.paths.stories, '.storybook')
      : path.resolve('node_modules/reaction-build/lib/storybook');
    spinner.stop();
    await easycp(
      `node node_modules/@storybook/react/bin/build  -c ${storiesPath}${
        options.debug ? ' -- --debug' : ''
      }${options.verbose ? ' -- --verbose' : ''} -o ${paths.distStorybook}`
    );
  } else {
    if (fs.existsSync(paths.srcPublic)) {
      fs.copySync(paths.srcPublic, paths.distWebPublic, {
        dereference: true
      });
    } else {
      fs.mkdirsSync(paths.distWebPublic);
    }
    const { stats, previousFileSizes, warnings } = await runBuild(
      config,
      await measureFileSizesBeforeBuild(paths.distWebPublic)
    );
    if (warnings.length) {
      spinner.warn('built web');
      log.info(warnings.join('\n\n'));
    } else {
      spinner.succeed('built web');
    }
    log.info('file sizes after gzip:\n');
    printFileSizesAfterBuild(stats, previousFileSizes, paths.distWeb);
    log.info('');
  }
}

async function runBuild(config, previousFileSizes) {
  const webpackWebConfig = createWebpackConfig('web', 'build', config);
  log.debug('webpackWebConfig', webpackWebConfig);
  const webpackNodeConfig = createWebpackConfig('node', 'build', config);
  log.debug('webpackNodeConfig', webpackNodeConfig);
  process.noDeprecation = true;
  const webSpinner = ora('compiling web').start();
  const webStats = await compile(webpackWebConfig);
  const webMessages = handleStats(webStats, config);
  webSpinner.succeed('compiled web');
  const serverSpinner = ora('compiling server').start();
  const nodeStats = await compile(webpackNodeConfig);
  const nodeMessages = handleStats(nodeStats, config);
  serverSpinner.succeed('compiled server');
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
