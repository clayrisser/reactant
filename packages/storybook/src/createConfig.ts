import path from 'path';
import { Config, Context, PlatformOptions } from '@reactant/plugin';

export default function createConfig(
  config: Partial<Config>,
  context: Context,
  _options: PlatformOptions
): Partial<Config> {
  const { paths } = context;
  if (context.platformName === 'expo') {
    config.include?.push(
      path.resolve(paths.root, 'node_modules/react-native-swipe-gestures'),
      path.resolve(__dirname, 'reactNative')
    );
  }
  return config;
}
