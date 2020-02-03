import path from 'path';
import {
  Config,
  Context,
  LoadedPlugin,
  LoadedPlugins,
  Plugin,
  PluginOptions
} from '@reactant/types';
import merge from './merge';
import { requireDefault } from './node';

let _plugins: LoadedPlugins;

export function getPlugins(rootPath: string): LoadedPlugins {
  if (_plugins && Object.keys(_plugins).length) return _plugins;
  const dependencyNames: string[] = Object.keys(
    // eslint-disable-next-line global-require,import/no-dynamic-require
    require(path.resolve(rootPath, 'package.json')).dependencies
  );
  _plugins = dependencyNames
    .filter((dependencyName: string) => {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return !!require(path.resolve(
        rootPath,
        'node_modules',
        dependencyName,
        'package.json'
      )).reactantPlugin;
    })
    .reduce((plugins: LoadedPlugins, moduleName: string) => {
      const pluginPath = path.resolve(
        rootPath,
        'node_modules',
        moduleName,
        // eslint-disable-next-line global-require,import/no-dynamic-require
        require(path.resolve(
          rootPath,
          'node_modules',
          moduleName,
          'package.json'
        )).reactantPlugin
      );
      const requiredPlugin: Plugin = requireDefault<Plugin>(pluginPath);
      const plugin: LoadedPlugin = {
        actions: requiredPlugin.actions || {},
        disabledPlatforms: new Set(requiredPlugin.disabledPlatforms || []),
        moduleName,
        name: requiredPlugin.name || moduleName,
        options: requiredPlugin.defaultOptions || {},
        path: pluginPath,
        supportedPlatforms: new Set(requiredPlugin.supportedPlatforms || []),
        config:
          requiredPlugin.config ||
          ((
            config: Partial<Config>,
            _context: Context,
            _options: PluginOptions
          ) => config)
      };
      plugins[plugin.name] = plugin;
      return plugins;
    }, {});
  return _plugins;
}

export function getPlugin(
  pluginName: string,
  rootPath: string,
  pluginOptions: PluginOptions = {}
): LoadedPlugin | null {
  const plugins = getPlugins(rootPath);
  const plugin = plugins[pluginName];
  if (!plugin) return null;
  plugin.options = merge<PluginOptions>(plugin.options, pluginOptions || {});
  return plugin;
}
