import { Context, Logger, PlatformApi } from '@reactant/platform';
import createCracoConfig from '../createCracoConfig';

export default async function start(
  context: Context,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing start');
  const cracoConfigPath = await createCracoConfig(context);
  logger.spinner.succeed('prepared start');
  logger.spinner.succeed('started');
  return platformApi.spawn(
    ['@craco/craco', 'craco'],
    ['start', '--config', cracoConfigPath]
  );
}
