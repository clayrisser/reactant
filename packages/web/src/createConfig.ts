import path from 'path';
import { Config, Context, PlatformOptions } from '@reactant/platform';

export default function createConfig(
  config: Partial<Config>,
  context: Context,
  _options: PlatformOptions
): Partial<Config> {
  if (!config.webpack) config.webpack = {};
  if (!config.webpack.resolve) config.webpack.resolve = {};
  if (!config.webpack.resolve.alias) config.webpack.resolve.alias = {};
  config.webpack.resolve.alias.react = path.resolve(
    context.paths.root,
    'node_modules/react'
  );
  config.webpack.resolve.alias['react-dom'] = path.resolve(
    context.paths.root,
    'node_modules/react-dom'
  );
  config.webpack.resolve.alias['~'] = path.resolve(context.paths.root, 'src');
  return config;
}
