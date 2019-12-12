import path from 'path';
import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function storybook(
  _context: Context,
  _logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  return platformApi.spawn('@storybook/react', 'start-storybook', [
    '-c',
    path.resolve(__dirname, '../storybook')
  ]);
}
