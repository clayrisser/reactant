import util from 'util';
import { Context, Logger } from '@reactant/types';
import { finish } from '@reactant/context';
import build from './build';
import clean from './clean';
import start from './start';

export async function preProcess(
  context: Context,
  logger: Logger
): Promise<Context> {
  if (context.debug) {
    logger.debug(
      '\n======== START CONTEXT ========\n',
      util.inspect(context, {
        colors: true,
        showHidden: true,
        depth: null
      }),
      '\n========= END CONTEXT =========\n'
    );
  }
  return context;
}

export async function postProcess(
  context: Context,
  _logger: Logger
): Promise<Context> {
  finish();
  return context;
}

export { build, clean, start };
