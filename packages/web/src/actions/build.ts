import { Config, Logger, PlatformApi } from '@reactant/platform';
import asyncCrossSpawn from 'async-cross-spawn';

export default async function build(
  _config: Config,
  _logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  await platformApi.prepareBuild();
  return asyncCrossSpawn('react-scripts', ['build'], { stdio: 'inherit' });
}
