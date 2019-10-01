import { Config, Logger, PlatformApi } from '@reactant/platform';
import asyncCrossSpawn from 'async-cross-spawn';

export default async function build(
  config: Config,
  logger: Logger,
  platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('preparing build');
  await platformApi.steps.prepareBuild(config);
  await platformApi.templateCracoConfig(config);
  logger.spinner.succeed('prepared build');
  return asyncCrossSpawn('react-scripts', ['build'], { stdio: 'inherit' });
}
