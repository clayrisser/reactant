import { Config } from '@reactant/core';

export default async function build(config: Config, logger: any): Promise<any> {
  logger.info(config);
}
