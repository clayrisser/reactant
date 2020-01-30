import path from 'path';
import { Context } from '@reactant/types';

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
        root: [
          path.resolve(context.paths.root, context.platformName, 'node_modules')
        ]
      }
    ]);
  }
  context.config = config;
  return context;
}
