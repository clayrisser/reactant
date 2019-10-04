import mergeConfiguration from 'merge-configuration';
import path from 'path';
import { oc } from 'ts-optchain.macro';
import { Config } from '../types';
import {
  CalculatedPlatform,
  CalculatedPlatforms,
  Platform,
  PlatformOptions,
  Platforms
} from './types';

let _platforms: CalculatedPlatforms;

function requireDefault<T = any>(moduleName: string): T {
  const required = require(moduleName);
  if (required.__esModule && required.default) return required.default;
  return required;
}

export function getReactantPlatforms(config: Config): CalculatedPlatforms {
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
    .reduce((platforms: Platforms, moduleName: string) => {
      const platformPath = path.resolve(
        config.rootPath,
        'node_modules',
        moduleName,
        require(path.resolve(
          config.rootPath,
          'node_modules',
          moduleName,
          'package.json'
        )).reactantPlatform
      );
      const platform: Platform & CalculatedPlatform = {
        ...requireDefault(platformPath),
        moduleName,
        path: platformPath
      };
      platform.options = (platform.defaultOptions as unknown) as PlatformOptions;
      delete platform.defaultOptions;
      if (!platform.name) platform.name = moduleName;
      platform.origionalName = platform.name;
      if (platform.options.name) platform.name = platform.options.name;
      platforms[platform.name] = platform;
      return platforms as CalculatedPlatforms;
    }, {});
  return _platforms;
}

export function getReactantPlatform(
  platformName: string,
  config: Config
): CalculatedPlatform {
  const userPlatformOptions = oc(config).platforms[platformName](
    {} as PlatformOptions
  );
  const platforms = getReactantPlatforms(config);
  const platform = platforms[platformName];
  platform.options = mergeConfiguration<PlatformOptions>(
    platform.options,
    userPlatformOptions
  );
  return platform;
}

export * from './types';
