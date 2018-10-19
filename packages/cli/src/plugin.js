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
    {}
  );
}

function loadReactantPlugins(config, pluginNames) {
  return _.reduce(
    pluginNames,
    (plugins, pluginName) => {
      plugins[pluginName] = loadReactantPlugin(config, pluginName);
      return plugins;
    },
    {}
  );
}

function loadReactantPlugin(config, pluginName) {
  const { paths } = config;
  const rootPath = path.resolve(paths.root, 'node_modules', pluginName);
  const packagePkg = require(path.resolve(rootPath, 'package.json'));
  let plugin = require(path.resolve(rootPath, packagePkg.reactantPlugin));
  if (plugin.__esModule) plugin = plugin.default;
  return plugin;
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
