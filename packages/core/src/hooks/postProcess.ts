import { Context, Logger } from '@reactant/types';
import cleanup from './cleanup';

export default function postProcess(context: Context, logger: Logger): Context {
  cleanup(context, logger);
  return context;
}
