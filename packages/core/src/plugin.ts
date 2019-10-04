import mergeConfiguration from 'merge-configuration';
import path from 'path';
import { oc } from 'ts-optchain.macro';
import {
  CalculatedPlugin,
  CalculatedPlugins,
  Config,
  Plugin,
  PluginOptions,
  Plugins
} from './types';

let _plugins: CalculatedPlugins;

export function requireDefault<T = any>(moduleName: string): T {
  const required = require(moduleName);
  if (required.__esModule && required.default) return required.default;
  return required;
}

export function getReactantPlugins(config: Config): CalculatedPlugins {
  if (_plugins && Object.keys(_plugins).length) return _plugins;
  const dependencyNames: string[] = Object.keys(
    require(path.resolve(config.rootPath, 'package.json')).dependencies
  );
  _plugins = dependencyNames
    .filter((dependencyName: string) => {
      return !!require(path.resolve(
        config.rootPath,
        'node_modules',
        dependencyName,
        'package.json'
      )).reactantPlugin;
    })
    .reduce((plugins: Plugins, moduleName: string) => {
      const pluginPath = path.resolve(
        config.rootPath,
        'node_modules',
        moduleName,
        require(path.resolve(
          config.rootPath,
          'node_modules',
          moduleName,
          'package.json'
        )).reactantPlugin
      );
      const plugin: Plugin & CalculatedPlugin = {
        ...requireDefault(pluginPath),
        moduleName,
        path: pluginPath
      };
      if (!plugin.name) plugin.name = moduleName;
      else plugins[moduleName] = plugin;
      plugin.options = (plugin.defaultOptions as unknown) as PluginOptions;
      delete plugin.defaultOptions;
      plugins[plugin.name] = plugin;
      return plugins as CalculatedPlugins;
    }, {});
  return _plugins;
}

export function getReactantPlugin(
  pluginName: string,
  config: Config
): CalculatedPlugin {
  const userPluginOptions = oc(config).plugins[pluginName]({} as PluginOptions);
  const plugins = getReactantPlugins(config);
  const plugin = plugins[pluginName];
  plugin.options = mergeConfiguration<PluginOptions>(
    plugin.options,
    userPluginOptions
  );
  return plugin;
}
