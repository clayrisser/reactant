import path from 'path';
import { Config } from './config';
import { getReactantPlatforms } from './platform';

let _plugins: Plugins;

export interface Plugin {
  moduleName: string;
  name: string;
  supportedPlatforms: string[];
}

export interface Plugins {
  [key: string]: Plugin;
}

export async function getReactantPlugins(
  platformName: string,
  config: Config
): Promise<Plugins> {
  const platforms = await getReactantPlatforms(config);
  const platform = platforms[platformName];
  if (_plugins && Object.keys(_plugins).length) return _plugins;
  const { paths } = config;
  const dependencyNames: string[] = Object.keys(
    require(path.resolve(paths.root, 'package.json')).dependencies
  );
  _plugins = dependencyNames
    .filter((dependencyName: string) => {
      return !!require(path.resolve(
        paths.root,
        'node_modules',
        dependencyName,
        'package.json'
      )).reactantPlugin;
    })
    .reduce((plugins: Plugins, pluginName: string) => {
      const plugin: Plugin = {
        moduleName: pluginName,
        ...require(path.resolve(
          paths.root,
          'node_modules',
          pluginName,
          require(path.resolve(
            paths.root,
            'node_modules',
            pluginName,
            'package.json'
          )).reactantPlugin
        ))
      };
      const supportedPlatforms = new Set(plugin.supportedPlatforms);
      if (
        supportedPlatforms.has(platform.name) ||
        supportedPlatforms.has(platform.moduleName)
      ) {
        if (!plugin.name) plugin.name = pluginName;
        else plugins[pluginName] = plugin;
        plugins[plugin.name] = plugin;
      }
      return plugins;
    }, {});
  return _plugins;
}
