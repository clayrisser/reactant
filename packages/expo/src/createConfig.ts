import fs from 'fs-extra';
import path from 'path';
import { Config, Context, PlatformOptions } from '@reactant/platform';

export default function createConfig(
  config: Partial<Config>,
  context: Context,
  _options: PlatformOptions
): Partial<Config> {
  const { paths } = context;
  config.include?.push(
    path.resolve(paths.root, 'node_modules/@expo'),
    path.resolve(paths.root, 'node_modules/@reactant/expo/ts'),
    path.resolve(paths.root, 'node_modules/expo'),
    path.resolve(paths.root, 'node_modules/react-native')
  );
  if (!config.babel) config.babel = {};
  if (!config.babel.presets) config.babel.presets = [];
  config.babel.presets.push('babel-preset-expo');
  if (!config.babel.plugins) config.babel.plugins = [];
  config.babel.plugins.push([
    'babel-plugin-module-resolver',
    {
      alias: {
        ...(fs.pathExistsSync(
          path.resolve(context.paths.root, 'node_modules/react-dom')
        )
          ? {
              'react-dom': path.resolve(
                context.paths.root,
                'node_modules/react-dom'
              )
            }
          : {}),
        'react-native': path.resolve(
          context.paths.root,
          'node_modules/react-native'
        )
      }
    }
  ]);
  return config;
}
