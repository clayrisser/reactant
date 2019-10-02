import path from 'path';
import { Config, CalculatedPlugins, Plugins, Plugin } from './types';

let _plugins: CalculatedPlugins;

export function requireDefault<T = any>(moduleName: string): T {
  const required = require(moduleName);
  if (required.__esModule && required.default) return required.default;
  return required;
}

export async function getReactantPlugins(
  config: Config
): Promise<CalculatedPlugins> {
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
    .reduce((platforms: Plugins, platformName: string) => {
      const platform = {
        ...requireDefault(
          path.resolve(
            config.rootPath,
            'node_modules',
            platformName,
            require(path.resolve(
              config.rootPath,
              'node_modules',
              platformName,
              'package.json'
            )).reactantPlugin
          )
        ),
        moduleName: platformName
      };
      if (!platform.name) platform.name = platformName;
      else platforms[platformName] = platform;
      platforms[platform.name] = platform;
      return platforms as CalculatedPlugins;
    }, {});
  return _plugins;
}

export async function getReactantPlugin(
  platformName: string,
  config: Config
): Promise<Plugin> {
  const platforms: Plugins = await getReactantPlugins(config);
  return platforms[platformName];
}
