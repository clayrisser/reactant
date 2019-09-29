import { Config, Logger } from '@reactant/platform';
import asyncCrossSpawn from 'async-cross-spawn';

export default async function test(
  _config: Config,
  _logger: Logger
): Promise<any> {
  return asyncCrossSpawn('react-scripts', ['test'], { stdio: 'inherit' });
}
