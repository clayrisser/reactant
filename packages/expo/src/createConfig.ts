import fs, { Dirent } from 'fs-extra';
import path from 'path';
import { Config, Context, PlatformOptions } from '@reactant/platform';

export default function createConfig(
  config: Partial<Config>,
  context: Context,
  _options: PlatformOptions
): Partial<Config> {
  const { paths } = context;
  config.include?.push(
    ...getExpoPaths(context),
    path.resolve(paths.root, 'node_modules/@expo'),
    path.resolve(paths.root, 'node_modules/@unimodules'),
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

export function getExpoPaths(context: Context): string[] {
  return fs
    .readdirSync(path.resolve(context.paths.root, 'node_modules'), {
      withFileTypes: true
    })
    .filter((dirent: Dirent) => dirent.isDirectory())
    .reduce((expoPaths: string[], dirent: Dirent) => {
      if (
        dirent.name.substr(0, 5) === 'expo-' ||
        dirent.name.substr(0, 11) === 'unimodules-'
      ) {
        expoPaths.push(
          path.resolve(context.paths.root, 'node_modules', dirent.name)
        );
      }
      return expoPaths;
    }, []);
}
