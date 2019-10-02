import { Config, PlatformApi } from '@reactant/types';

export default async function build(
  config: Config,
  logger: any,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('cleaning');
  await platformApi.cleanPaths([], config);
  logger.spinner.succeed('cleaned');
}
