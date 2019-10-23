import { Config, Logger, PlatformApi } from '@reactant/platform';

export default async function build(
  config: Config,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('cleaning');
  await platformApi.cleanPaths([], config);
  logger.spinner.succeed('cleaned');
}
