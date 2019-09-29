import { Config, Logger } from '@reactant/platform';

export default async function start(
  config: Config,
  logger: Logger
): Promise<any> {
  logger.info(config);
}
