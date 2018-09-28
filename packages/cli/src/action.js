import Err from 'err';
import Promise from 'bluebird';
import _ from 'lodash';
import commander from 'commander';
import log, { setLevel } from '@reactant/base/log';
import ora from 'ora';
import validate from './validate';
import { Socket, loadConfig, createConfig } from './config';
import { createWebpackConfig } from './webpack';
import { loadReactantPlatform, getReactantPlatforms } from './platform';

export default async function action(cmd, options) {
  if (options.verbose) setLevel('verbose');
  if (options.debug) setLevel('debug');
  await validate(cmd, options);
  let config = createConfig({
    action: cmd,
    options
  });
  const reactantPlatforms = getReactantPlatforms(config);
  if (!_.includes(_.keys(config.platforms), options.platform)) {
    throw new Err(`invalid platform '${options.platform}'`, 400);
  }
  const platformName = config.platforms[options.platform];
  if (!_.includes(reactantPlatforms, platformName)) {
    throw new Err(`reactant platform '${platformName}' is not installed`, 400);
  }
  process.env.NODE_ENV = config.env;
  const platform = loadReactantPlatform(config, platformName);
  if (!platform.actions[cmd]) return commander.help();
  config = loadConfig({
    action: cmd,
    defaultEnv: 'development',
    options,
    platformConfig: platform.config || {}
  });
  const socket = new Socket({ silent: !options.debug });
  await socket.start();
  await runActions(config, { platform });
  return socket.stop();
}

async function runActions(config, { platform }) {
  const webpackConfig = createWebpackConfig(config);
  await Promise.mapSeries(
    getActionNames(config.action, platform),
    async actionName => {
      let action = platform.actions[actionName];
      action = { ...action, name: actionName };
      const spinner = ora(`started ${action.name} ${config.platform}`).start();
      spinner._succeed = spinner.succeed;
      spinner.succeed = (...args) => {
        spinner._succeed(
          ...(args.length
            ? args
            : [`finished ${action.name} ${config.platform}`])
        );
      };
      return action.run(config, {
        platform,
        action,
        spinner,
        webpackConfig,
        log
      });
    }
  );
  return null;
}

function getActionNames(actionName, platform, actionNames = []) {
  return _.uniq(
    _.flattenDeep([
      ...actionNames,
      ..._.map(platform.actions[actionName].dependsOn, actionName => {
        if (_.includes(actionNames, actionName)) {
          log.warn(`circular action found for '${actionName}'`);
          return [actionName];
        }
        return getActionNames(actionName, platform, [
          ...actionNames,
          actionName
        ]);
      }),
      actionName
    ])
  );
}
