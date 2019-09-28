import { Config } from '@reactant/core';

export default async function start(config: Config, logger: any): Promise<any> {
  logger.info(config);
}
