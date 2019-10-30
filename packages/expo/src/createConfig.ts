import path from 'path';
import { Config, Context } from '@reactant/platform';

export default function createConfig(
  config: Partial<Config>,
  context: Context
): Partial<Config> {
  if (!config.babel) config.babel = {};
  if (!config.babel.presets) config.babel.presets = [];
  config.babel.presets.push('expo');
  if (!config.babel.plugins) config.babel.plugins = [];
  config.babel.plugins.push([
    'module-resolver',
    {
      root: [path.resolve(context.paths.root, 'src')],
      alias: { '~': path.resolve(context.paths.root, 'src') }
    }
  ]);
  return config;
}
