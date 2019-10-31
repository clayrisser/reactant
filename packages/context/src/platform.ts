import path from 'path';
import {
  LoadedPlatform,
  LoadedPlatforms,
  Platform,
  PlatformOptions,
  PlatformsOptions
} from '@reactant/types';
import merge from './merge';
import { requireDefault } from './util';

let _platforms: LoadedPlatforms;

export function getPlatforms(
  rootPath: string,
  platformsOptions: PlatformsOptions = {}
): LoadedPlatforms {
  if (_platforms && Object.keys(_platforms).length) return _platforms;
  const dependencyNames: string[] = Object.keys(
    // eslint-disable-next-line global-require,import/no-dynamic-require
    require(path.resolve(rootPath, 'package.json')).dependencies
  );
  _platforms = dependencyNames
    .filter((dependencyName: string) => {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return !!require(path.resolve(
        rootPath,
        'node_modules',
        dependencyName,
        'package.json'
      )).reactantPlatform;
    })
    .reduce((platforms: LoadedPlatforms, moduleName: string) => {
      const platformPath = path.resolve(
        rootPath,
        'node_modules',
        moduleName,
        // eslint-disable-next-line global-require,import/no-dynamic-require
        require(path.resolve(
          rootPath,
          'node_modules',
          moduleName,
          'package.json'
        )).reactantPlatform
      );
      const requiredPlatform: Platform = requireDefault<Platform>(platformPath);
      const platform: LoadedPlatform = {
        actions: requiredPlatform.actions,
        config: requiredPlatform.config,
        moduleName,
        name: requiredPlatform.name,
        options: merge<PlatformOptions>(
          requiredPlatform.defaultOptions,
          platformsOptions[requiredPlatform.name || moduleName]
        ),
        origionalName: requiredPlatform.name,
        path: platformPath
      };
      if (!platform.name) platform.name = moduleName;
      platform.origionalName = platform.name;
      // eslint-disable-next-line no-restricted-globals
      if (platform.options?.name) platform.name = platform.options.name;
      platforms[platform.name] = platform;
      return platforms;
    }, {});
  return _platforms;
}

export function getPlatform(
  platformName: string,
  rootPath: string,
  platformOptions: PlatformOptions = {}
): LoadedPlatform | null {
  const platforms = getPlatforms(rootPath, { [platformName]: platformOptions });
  const platform = platforms[platformOptions.name || platformName];
  if (!platform) return null;
  platform.options = merge<PlatformOptions>(
    platform.options,
    platformOptions || {}
  );
  return platform;
}
