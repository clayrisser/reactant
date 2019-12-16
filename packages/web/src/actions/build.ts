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
  await fs.mkdirs(context.paths.dist);
  await fs.remove(context.paths.dist);
  logger.spinner.succeed('prepared build');
  await platformApi.spawn('@craco/craco', 'craco', [
    'build',
    '--config',
    cracoConfigPath
  ]);
  logger.spinner.start('finalizing build');
  await fs.move(context.paths.build, context.paths.dist);
  logger.spinner.succeed('built');
}
