import { Config, PlatformApi } from '@reactant/types';

export default async function test(
  _config: Config,
  _logger: any,
  platformApi: PlatformApi
): Promise<any> {
  return platformApi.spawn('@craco/craco', 'craco', ['test']);
}
