import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function build(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
  logger: Logger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('building');
  logger.spinner.succeed('built');
}
