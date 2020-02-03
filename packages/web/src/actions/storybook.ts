import fs from 'fs-extra';
import path from 'path';
import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function storybook(
  context: Context,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing storybook');
  const storybookPath = path.resolve(context.paths.tmp, 'storybook');
  await fs.copy(path.resolve(__dirname, '../storybook'), storybookPath);
  logger.spinner.succeed('prepared storybook');
  return platformApi.spawn('@storybook/react', 'start-storybook', [
    ...(context.debug ? ['--debug-webpack'] : []),
    '-c',
    storybookPath
  ]);
}
