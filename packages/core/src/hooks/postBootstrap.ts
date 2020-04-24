import fs from 'fs-extra';
import path from 'path';
import { Context } from '@reactant/types';

export interface AliasedModules {
  [key: string]: string;
}

export function getIncludePaths(context: Context): string[] {
  return [
    ...(context.config?.include || []),
    path.resolve(
      context.paths.root,
      'node_modules/@reactant/config/es/index.js'
    ),
    path.resolve(
      context.paths.root,
      'node_modules/@reactant/context/es/index.js'
    ),
    path.resolve(
      context.paths.root,
      'node_modules/@reactant/config/lib/index.js'
    ),
    path.resolve(
      context.paths.root,
      'node_modules/@reactant/context/lib/index.js'
    ),
    path.resolve(
      context.paths.root,
      'node_modules/@reactant/platform/es/index.js'
    ),
    path.resolve(
      context.paths.root,
      'node_modules/@reactant/plugin/es/index.js'
    ),
    path.resolve(context.paths.root, 'node_modules/@reactant/platform/ts'),
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
    config.babel.plugins.push('babel-plugin-macros');
  }
  config.babel.plugins = config.babel.plugins.filter(
    (plugin: string) =>
      plugin !== 'module-resolver' && plugin !== 'babel-plugin-module-resolver'
  );
  if (
    !config.babel.plugins.some(
      (plugin: any) =>
        plugin?.[0] === 'babel-plugin-module-resolver' ||
        plugin?.[0] === 'module-resolver'
    )
  ) {
    config.babel.plugins.push(['babel-plugin-module-resolver', {}]);
  }
  const babelPluginModuleResolver = config.babel.plugins.find(
    (plugin: string | string[]) => {
      const pluginNames = ['babel-plugin-module-resolver', 'module-resolver'];
      if (Array.isArray(plugin)) {
        if (plugin.length < 2) return false;
        return pluginNames.includes(plugin[0]);
      }
      return false;
    }
  );
  babelPluginModuleResolver[1] = {
    ...(babelPluginModuleResolver?.[1] || {}),
    alias: {
      ...(babelPluginModuleResolver?.[1].alias || {}),
      '@reactant/_config': path.resolve(context.paths.tmp, 'config.json'),
      '@reactant/_context': path.resolve(context.paths.tmp, 'context.json'),
      '@reactant/_platform': path.resolve(context.paths.tmp, 'platform.json'),
      '@reactant/_plugins': path.resolve(context.paths.tmp, 'plugins.json'),
      '~': path.resolve(context.paths.root, 'src'),
      react: path.resolve(context.paths.root, 'node_modules/react'),
      ...getAliasedModules(
        path.resolve(context.paths.root, context.platformName, 'node_modules')
      )
    }
  };
  config.babel.include = [
    ...new Set([
      ...(config.babel.include || []),
      ...context.includePaths,
      path.resolve(context.paths.root, 'src'),
      path.resolve(context.paths.root, context.platformName)
    ])
  ];
  context.config = config;
  return context;
}
