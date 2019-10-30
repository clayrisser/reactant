import { Config } from '@reactant/platform';

export default function createConfig(config: Partial<Config>): Partial<Config> {
  if (!config.babel) config.babel = {};
  if (!config.babel.presets) config.babel.presets = [];
  config.babel.presets.push('expo');
  if (!config.babel.plugins) config.babel.plugins = [];
  config.babel.plugins.push([
    'module-resolver',
    {
      root: ['./src'],
      alias: { '~': './src' }
    }
  ]);
  return config;
}
