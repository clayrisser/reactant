import { Context, Logger, Api } from '@reactant/platform';
import createCracoConfig from '../createCracoConfig';

export default async function start(
  context: Context,
  logger: Logger,
  api: Api
): Promise<any> {
  logger.spinner.start('preparing start');
  const cracoConfigPath = await createCracoConfig(context);
  logger.spinner.succeed('prepared start');
  logger.spinner.succeed('started');
  await api.spawn(
    ['@craco/craco', 'craco'],
    ['start', '--config', cracoConfigPath]
  );
  return null;
}
