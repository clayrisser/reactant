import { Context, Logger, Api } from '@reactant/platform';

export default async function clean(
  _context: Context,
  logger: Logger,
  api: Api
): Promise<any> {
  logger.spinner.info('cleaning');
  await api.spawn('git', [
    'clean',
    '-fXd',
    '-e',
    '!node_modules',
    '-e',
    '!node_modules/**/*'
  ]);
  logger.spinner.succeed('cleaned');
  return null;
}
