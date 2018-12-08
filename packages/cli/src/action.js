import Err from 'err';
import TrailDuck from 'trailduck';
import _ from 'lodash';
import log, { setLevel } from '@reactant/core/log';
import ora from 'ora';
import { mapSeries } from 'bluebird';
import { createConfig } from './config';
import { createWebpackConfig } from './webpack';

export default async function action(cmd, options, spinner) {
  if (options.verbose) setLevel('verbose');
  if (options.debug) setLevel('debug');
  let config = createConfig({
    action: cmd,
    options
  });
  config = createConfig({
    action: cmd,
    options
  });
  spinner.succeed('loaded config');
  await runActions(config).catch(err => {
    throw err;
  });
}

async function runActions(config) {
  const { platform } = config;
  const webpackConfig = createWebpackConfig(config);
  await mapSeries(getActionNames(config.action, platform), async actionName => {
    let action = platform.properties.actions[actionName];
    action = { ...action, name: actionName };
    const spinner = ora(
      `started ${action.name} ${platform.properties.name}`
    ).start();
    spinner._succeed = spinner.succeed;
    spinner.succeed = (...args) => {
      spinner._succeed(
        ...(args.length
          ? args
          : [`finished ${action.name} ${config.platform.properties.name}`])
      );
    };
    return action.run(config, {
      platform,
      action,
      spinner,
      webpackConfig,
      log
    });
  });
  return null;
}

function getActionGraph(actionName, platform, graph = {}) {
  const action = platform.properties.actions[actionName];
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
