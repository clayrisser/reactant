import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function clean(
  _context: Context,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.info('cleaning');
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
