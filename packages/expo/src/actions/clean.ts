import { Context, Logger, Api } from '@reactant/platform';

export default async function clean(
  _context: Context,
  logger: Logger,
  api: Api
): Promise<any> {
  await api.spawn('git', [
    'clean',
    '-fXd',
    '-e',
    '!node_modules',
    '-e',
    '!node_modules/**/*'
  ]);
  logger.spinner.succeed('cleaned');
}
