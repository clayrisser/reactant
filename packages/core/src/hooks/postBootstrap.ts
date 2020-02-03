import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Context } from '@reactant/types';

export interface AliasedModules {
  [key: string]: string;
}

export function getIncludePaths(context: Context): string[] {
  return [
    path.resolve(
      fs.realpathSync(pkgDir.sync(require.resolve('@reactant/config'))!),
      'es/index.js'
    ),
    path.resolve(
      fs.realpathSync(pkgDir.sync(require.resolve('@reactant/context'))!),
      'es/index.js'
    ),
    path.resolve(
      fs.realpathSync(pkgDir.sync(require.resolve('@reactant/platform'))!),
      'es/index.js'
    ),
    path.resolve(
      fs.realpathSync(pkgDir.sync(require.resolve('@reactant/plugin'))!),
      'es/index.js'
    ),
    path.resolve(context.paths.root, context.paths.tmp)
  ];
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
  context.includePaths = getIncludePaths(context);
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
          '@reactant/_config': path.resolve(context.paths.tmp, 'config.json'),
          '@reactant/_context': path.resolve(context.paths.tmp, 'context.json'),
          '@reactant/_plugins': path.resolve(context.paths.tmp, 'plugins.json'),
          '@reactant/_platform': path.resolve(
            context.paths.tmp,
            'platform.json'
          ),
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
  config.babel.include = [
    ...(config.babel.include || []),
    ...context.includePaths
  ];
  context.config = config;
  return context;
}
