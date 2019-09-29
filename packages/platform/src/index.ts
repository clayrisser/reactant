import path from 'path';
import { Config } from '@reactant/config';
import { CalculatedPlatforms, Platform, Platforms } from './types';

let _platforms: CalculatedPlatforms;

export function requireDefault<T = any>(moduleName: string): T {
  const required = require(moduleName);
  if (required.__esModule && required.default) return required.default;
  return required;
}

export async function getReactantPlatforms(
  config: Config
): Promise<CalculatedPlatforms> {
  if (_platforms && Object.keys(_platforms).length) return _platforms;
  const dependencyNames: string[] = Object.keys(
    require(path.resolve(config.rootPath, 'package.json')).dependencies
  );
  _platforms = dependencyNames
    .filter((dependencyName: string) => {
      return !!require(path.resolve(
        config.rootPath,
        'node_modules',
        dependencyName,
        'package.json'
      )).reactantPlatform;
    })
    .reduce((platforms: Platforms, platformName: string) => {
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
            )).reactantPlatform
          )
        ),
        moduleName: platformName
      };
      if (!platform.name) platform.name = platformName;
      else platforms[platformName] = platform;
      platforms[platform.name] = platform;
      return platforms as CalculatedPlatforms;
    }, {});
  return _platforms;
}

export async function getReactantPlatform(
  platformName: string,
  config: Config
): Promise<Platform> {
  const platforms: Platforms = await getReactantPlatforms(config);
  return platforms[platformName];
}

export * from './types';
