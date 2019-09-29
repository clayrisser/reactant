import { Config, Logger } from '@reactant/platform';

export default async function test(
  config: Config,
  logger: Logger
): Promise<any> {
  logger.info(config);
}
