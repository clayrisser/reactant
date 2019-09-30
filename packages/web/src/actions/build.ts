import { Config, Logger, isolateBuild } from '@reactant/platform';
import asyncCrossSpawn from 'async-cross-spawn';

export default async function build(
  _config: Config,
  _logger: Logger
): Promise<any> {
  await isolateBuild();
  return asyncCrossSpawn('react-scripts', ['build'], { stdio: 'inherit' });
}
