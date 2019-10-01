import { Config, Logger, PlatformApi } from '@reactant/platform';

export default async function test(
  _config: Config,
  _logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  return platformApi.spawn('@craco/craco', 'craco', ['test']);
}
