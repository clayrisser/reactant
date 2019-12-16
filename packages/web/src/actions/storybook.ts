import fs from 'fs-extra';
import path from 'path';
import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function storybook(
  context: Context,
  _logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  const storybookPath = path.resolve(context.paths.tmp, 'storybook');
  await fs.mkdirs(storybookPath);
  await fs.remove(storybookPath);
  await fs.copy(path.resolve(__dirname, 'storybook'), storybookPath);
  return platformApi.spawn('@storybook/react', 'start-storybook', [
    '-c',
    storybookPath
  ]);
}
