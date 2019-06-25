import Err from 'err';
import TrailDuck from 'trailduck';
import _ from 'lodash';
import log, { setLevel } from '@reactant/core/log';
import ora from 'ora';
import { createConfig } from '@reactant/core/config';
import { mapSeries } from 'bluebird';
import { createWebpackConfig } from './webpack';

export default async function action(cmd, options, spinner) {
  if (options.verbose) setLevel('verbose');
  if (options.debug) setLevel('debug');
  const config = createConfig({ action: cmd, options });
  log.debug('config ===>', config);
  spinner.succeed('loaded config');
  try {
    await runActions(config);
  } catch (err) {
    throw err;
  }
}

async function runActions(config, payload = {}) {
  const webpackConfig = createWebpackConfig(config);
  await mapSeries(
    getActionNames(config.action, config.platform),
    async actionName => {
      let action = config.platform.actions[actionName];
      action = { ...action, name: actionName };
      const spinner = ora(
        `started ${action.name} ${config.platform.name}`
      ).start();
      spinner._succeed = spinner.succeed;
      spinner.succeed = (...args) => {
        spinner._succeed(
          ...(args.length
            ? args
            : [`finished ${action.name} ${config.platform.name}`])
        );
      };
      return action.run(config, {
        ...payload,
        action,
        log,
        spinner,
        webpackConfig
      });
    }
  );
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
