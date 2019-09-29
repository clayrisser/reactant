import { Config, Logger } from '@reactant/platform';

export default async function build(
  config: Config,
  logger: Logger
): Promise<any> {
  logger.info(config);
}
