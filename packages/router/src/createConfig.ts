import { Config, Context, PlatformOptions } from '@reactant/plugin';

export default function createConfig(
  config: Partial<Config>,
  _context: Context,
  _options: PlatformOptions
): Partial<Config> {
  return config;
}
