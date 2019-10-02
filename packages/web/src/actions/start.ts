import { Config, PlatformApi } from '@reactant/types';

export default async function start(
  config: Config,
  logger: any,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing start');
  await platformApi.prepare(config);
  await platformApi.templateCracoConfig(config);
  logger.spinner.succeed('prepared start');
  return platformApi.spawn('@craco/craco', 'craco', ['start']);
}
