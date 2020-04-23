import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function clean(
  context: Context,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  await platformApi.spawn('git', [
    'clean',
    '-fXd',
    '-e',
    '!node_modules',
    '-e',
    '!node_modules/**/*'
  ]);
  logger.spinner.succeed('cleaned');
}
