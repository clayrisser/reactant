import fs from 'fs-extra';
import path from 'path';
import { Context } from '@reactant/types';

export interface AliasedModules {
  [key: string]: string;
}

export function getModules(modulesPath: string, prefix = ''): string[] {
  if (!fs.pathExistsSync(modulesPath)) return [];
  return fs
    .readdirSync(modulesPath)
    .filter(
      (moduleName: string) =>
        fs.pathExistsSync(path.resolve(modulesPath, moduleName)) &&
        fs
          .lstatSync(fs.realpathSync(path.resolve(modulesPath, moduleName)))
          .isDirectory()
    )
    .reduce((moduleNames: string[], moduleName: string) => {
      if (!prefix.length && moduleName[0] === '@') {
        moduleNames = moduleNames.concat(
          getModules(path.resolve(modulesPath, moduleName), moduleName)
        );
      } else {
        moduleNames.push(moduleName);
      }
      return moduleNames;
    }, []);
}

export function getAliasedModules(modulesPath: string): AliasedModules {
  return getModules(modulesPath).reduce(
    (aliasedModules: AliasedModules, moduleName: string) => {
      aliasedModules[moduleName] = path.resolve(modulesPath, moduleName);
      return aliasedModules;
    },
    {}
  );
}

export default function postBootstrap(context: Context): Context {
  const config = context.config!;
  if (!config.babel) config.babel = {};
  if (!config.babel.plugins) config.babel.plugins = [];
  if (
    !config.babel.plugins.some(
      (plugin: any) =>
        plugin === 'babel-plugin-macros' ||
        plugin === 'macros' ||
        plugin?.[0] === 'babel-plugin-macros' ||
        plugin?.[0] === 'macros'
    )
  ) {
    config.babel.plugins.push('macros');
  }
  if (
    !config.babel.plugins.some(
      (plugin: any) =>
        plugin === 'babel-plugin-module-resolver' ||
        plugin === 'module-resolver' ||
        plugin?.[0] === 'babel-plugin-module-resolver' ||
        plugin?.[0] === 'module-resolver'
    )
  ) {
    config.babel.plugins.push([
      'module-resolver',
      {
        alias: {
          '~': path.resolve(context.paths.root, 'src'),
          ...getAliasedModules(
            path.resolve(
              context.paths.root,
              context.platformName,
              'node_modules'
            )
          )
        }
      }
    ]);
  }
  context.config = config;
  return context;
}
