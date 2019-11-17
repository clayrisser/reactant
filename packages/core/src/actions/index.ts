import CircularJSON from 'circular-json';
import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import { Context, Logger } from '@reactant/types';
import { finish } from '@reactant/context';
import build from './build';
import clean from './clean';
import start from './start';

export async function cleanup(context: Context, _logger: Logger) {
  if (await fs.pathExists(path.resolve(__dirname, '../../../../lerna.json'))) {
    await fs.remove(path.resolve(__dirname, '../../../../../.tmp'));
  }
  try {
    await fs.remove(context.paths.tmp);
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    await fs.unlink(path.resolve(context.paths.reactant, 'config.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

export async function preProcess(
  context: Context,
  logger: Logger
): Promise<Context> {
  process.on('SIGINT', () => cleanup(context, logger));
  process.on('SIGTERM', () => cleanup(context, logger));
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
  if (await fs.pathExists(path.resolve(__dirname, '../../../../lerna.json'))) {
    await fs.mkdirs(path.resolve(__dirname, '../../../../../.tmp/reactant'));
    await fs.writeFile(
      path.resolve(__dirname, '../../../../../.tmp/reactant/config.json'),
      CircularJSON.stringify(context.config)
    );
  }
  await fs.writeFile(
    path.resolve(context.paths.reactant, 'config.json'),
    CircularJSON.stringify(context.config)
  );
  return context;
}

export async function postProcess(
  context: Context,
  logger: Logger
): Promise<Context> {
  await cleanup(context, logger);
  finish();
  return context;
}

export { build, clean, start };
