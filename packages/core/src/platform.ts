import path from 'path';
import { Actions } from './action';
import { Config } from './config';

let _platforms: Platforms;

export interface Platform {
  moduleName: string;
  name: string;
  actions: Actions;
}

export interface Platforms {
  [key: string]: Platform;
}

export async function getReactantPlatforms(config: Config): Promise<Platforms> {
  if (_platforms && Object.keys(_platforms).length) return _platforms;
  const { paths } = config;
  const dependencyNames: string[] = Object.keys(
    require(path.resolve(paths.root, 'package.json')).dependencies
  );
  _platforms = dependencyNames
    .filter((dependencyName: string) => {
      return !!require(path.resolve(
        paths.root,
        'node_modules',
        dependencyName,
        'package.json'
      )).reactantPlatform;
    })
    .reduce((platforms: Platforms, platformName: string) => {
      const platform = {
        moduleName: platformName,
        ...require(path.resolve(
          paths.root,
          'node_modules',
          platformName,
          require(path.resolve(
            paths.root,
            'node_modules',
            platformName,
            'package.json'
          )).reactantPlatform
        ))
      };
      if (!platform.name) platform.name = platformName;
      else platforms[platformName] = platform;
      platforms[platform.name] = platform;
      return platforms;
    }, {});
  return _platforms;
}
