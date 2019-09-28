import { Config } from '@reactant/core';

export default async function test(config: Config, logger: any): Promise<any> {
  logger.info(config);
}
