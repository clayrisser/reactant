import { Context, Logger } from '@reactant/types';
import cleanup from './cleanup';

export default async function postProcess(
  context: Context,
  logger: Logger
): Promise<Context> {
  cleanup(context, logger);
  return context;
}
