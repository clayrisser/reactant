import fs from 'fs-extra';
import { Context, Logger, PlatformApi } from '@reactant/platform';
import createCracoConfig from '../createCracoConfig';

export default async function build(
  context: Context,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing build');
  const cracoConfigPath = await createCracoConfig(context);
  logger.spinner.succeed('prepared build');
  logger.spinner.succeed('builded');
  return platformApi.spawn('@craco/craco', 'craco', [
    'build',
    '--config',
    cracoConfigPath
  ]);
}
