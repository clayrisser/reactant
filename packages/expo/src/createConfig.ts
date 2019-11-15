import path from 'path';
import { Config, Context, PlatformOptions } from '@reactant/platform';

export default function createConfig(
  config: Partial<Config>,
  context: Context,
  _options: PlatformOptions
): Partial<Config> {
  if (!config.babel) config.babel = {};
  if (!config.babel.presets) config.babel.presets = [];
  config.babel.presets.push('expo');
  if (!config.babel.plugins) config.babel.plugins = [];
  config.babel.plugins.push('macros');
  config.babel.plugins.push([
    'module-resolver',
    {
      root: [path.resolve(context.paths.root, 'src')],
      alias: {
        '@reactant/config': path.resolve(context.paths.tmp, 'config.json'),
        '~': path.resolve(context.paths.root, 'src')
      }
    }
  ]);
  return config;
}
