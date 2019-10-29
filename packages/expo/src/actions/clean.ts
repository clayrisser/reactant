import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function clean(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
  logger: Logger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('cleaning');
  logger.spinner.succeed('cleaned');
}
