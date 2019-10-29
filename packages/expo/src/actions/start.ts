import path from 'path';
import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function start(
  context: Context,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  // const cracoConfigPath = path.resolve(config.rootPath, 'craco.config.js');
  logger.spinner.start('preparing start');
  // await platformApi.prepareLocal(config);
  // await platformApi.createCracoConfig(cracoConfigPath, config);
  logger.spinner.succeed('prepared start');
  // await fs.copy(
  //   path.resolve(config.rootPath, config.platformName, 'index.js'),
  //   path.resolve(config.rootPath, 'node_modules/expo/AppEntry.js')
  // );
  logger.spinner.succeed('started');
  return platformApi.spawn('expo-cli', 'expo', [
    'start',
    '--config',
    path.resolve(context.paths.root, context.platformName, 'app.json'),
    '--web',
    '--clear'
  ]);
}
