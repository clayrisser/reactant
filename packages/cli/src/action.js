import Err from 'err';
import Promise from 'bluebird';
import TrailDuck from 'trailduck';
import _ from 'lodash';
import commander from 'commander';
import log, { setLevel } from '@reactant/core/log';
import ora from 'ora';
import { Socket, loadConfig, createConfig } from './config';
import { createWebpackConfig } from './webpack';
import { getReactantPluginsConfig } from './plugin';
import { loadReactantPlatform, getReactantPlatforms } from './platform';

export default async function action(cmd, options, spinner) {
  if (options.verbose) setLevel('verbose');
  if (options.debug) setLevel('debug');
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
    platformConfig: platform.config || {},
    platformType: platform.type,
    pluginsConfig: getReactantPluginsConfig(config, config.plugins)
  });
  const socket = new Socket({ silent: !options.debug });
  await socket.start();
  spinner.succeed('loaded config');
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

function getActionGraph(actionName, platform, graph = {}) {
  const action = platform.actions[actionName];
  graph[actionName] = { children: action.dependsOn };
  _.each(action.dependsOn, actionName => {
    if (!_.includes(_.keys(graph), actionName)) {
      graph = getActionGraph(actionName, platform, graph);
    }
  });
  return graph;
}

function getActionNames(actionName, platform) {
  const graph = getActionGraph(actionName, platform);
  const trailDuck = new TrailDuck(graph);
  const cyclicalActions = _.uniq(_.flatten(trailDuck.cycles));
  if (cyclicalActions.length) {
    throw new Err(
      `cyclical actions detected '${cyclicalActions.join("', '")}'`,
      500
    );
  }
  return _.map(trailDuck.ordered, 'name');
}
