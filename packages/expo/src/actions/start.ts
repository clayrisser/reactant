import path from 'path';
import fs from 'fs-extra';
import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function start(
  context: Context,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing start');
  await platformApi.createBabelConfig({ rootPath: true });
  logger.spinner.succeed('prepared start');
  await fs.copy(
    path.resolve(context.paths.root, context.platformName, 'index.js'),
    path.resolve(context.paths.root, 'node_modules/expo/AppEntry.js')
  );
  logger.spinner.succeed('started');
  return platformApi.spawn('expo-cli', 'expo', [
    'start',
    '--config',
    path.resolve(context.paths.root, context.platformName, 'app.json'),
    '--web',
    '--clear'
  ]);
}
