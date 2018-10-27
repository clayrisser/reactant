import Err from 'err';
import TrailDuck from 'trailduck';
import _ from 'lodash';
import mergeConfiguration from 'merge-configuration';
import path from 'path';

function getReactantPluginsConfig(config, pluginNames) {
  const plugins = loadReactantPlugins(config, pluginNames);
  return _.reduce(
    plugins,
    (config, plugin) => {
      return mergeConfiguration(config, plugin.config);
    },
    {
      ...config,
      plugins: _.map(plugins, 'name')
    }
  );
}

function loadReactantPlugins(config, pluginNames) {
  const plugins = _.reduce(
    pluginNames,
    (plugins, pluginName) => {
      if (_.isArray(pluginName) && pluginName.length) {
        [pluginName] = pluginName;
      }
      const plugin = loadReactantPlugin(config, pluginName);
      plugin.name = pluginName;
      plugins[pluginName] = plugin;
      return plugins;
    },
    {}
  );
  const graph = getPluginsGraph(plugins);
  const trailDuck = new TrailDuck(graph);
  const missingDependancies = _.xor(
    pluginNames,
    _.map(trailDuck.ordered, 'name')
  );
  if (missingDependancies.length) {
    throw new Err(
      `plugin dependencies missing '${missingDependancies.join("', '")}'`
    );
  }
  if (trailDuck.cycles.length) {
    const cyclicalDependancies = _.uniq(_.flatten(trailDuck.cycles));
    throw new Err(
      `cyclical plugin dependencies detected '${cyclicalDependancies.join(
        "', '"
      )}'`
    );
  }
  const orderedPlugins = _.reduce(
    _.reverse(_.map(trailDuck.ordered, 'name')),
    (orderedPlugins, pluginName) => {
      orderedPlugins[pluginName] = plugins[pluginName];
      return orderedPlugins;
    },
    {}
  );
  return orderedPlugins;
}

function loadReactantPlugin(config, pluginName) {
  const { paths } = config;
  const rootPath = path.resolve(paths.root, 'node_modules', pluginName);
  const packagePkg = require(path.resolve(rootPath, 'package.json'));
  let plugin = require(path.resolve(rootPath, packagePkg.reactantPlugin));
  if (plugin.__esModule) plugin = plugin.default;
  return plugin;
}

function getPluginsGraph(plugins) {
  return _.reduce(
    plugins,
    (graph, plugin, key) => {
      const children = plugin.dependsOn || [];
      graph[key] = {
        children
      };
      _.each(children, child => {
        if (!graph[child]) graph[child] = { children: [] };
      });
      return graph;
    },
    {}
  );
}

function getReactantPlugins(config) {
  const { paths } = config;
  const pluginNames = _.keys(
    require(path.resolve(paths.root, 'package.json')).dependencies
  );
  return _.filter(pluginNames, pluginName => {
    return !!require(path.resolve(
      paths.root,
      'node_modules',
      pluginName,
      'package.json'
    )).reactantPlugin;
  });
}

export { loadReactantPlugins, getReactantPlugins, getReactantPluginsConfig };
export default {
  loadReactantPlugins,
  getReactantPlugins,
  getReactantPluginsConfig
};
