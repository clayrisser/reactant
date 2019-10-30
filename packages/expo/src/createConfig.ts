import { Config } from '@reactant/platform';

export default function createConfig(config: Partial<Config>): Partial<Config> {
  if (!config.babel) config.babel = {};
  if (!config.babel.presets) config.babel.presets = [];
  config.babel.presets.push('expo');
  return config;
}
