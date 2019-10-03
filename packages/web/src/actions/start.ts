import path from 'path';
import { Config, Logger, PlatformApi } from '@reactant/platform';

export default async function start(
  config: Config,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  const { paths } = config;
  const cracoConfigPath = path.resolve(paths.tmp, 'craco.config.js');
  logger.spinner.start('preparing start');
  await platformApi.prepareLocal(config);
  await platformApi.createCracoConfig(cracoConfigPath, config);
  logger.spinner.succeed('prepared start');
  return platformApi.spawn('@craco/craco', 'craco', [
    'start',
    '--config',
    cracoConfigPath
  ]);
}
