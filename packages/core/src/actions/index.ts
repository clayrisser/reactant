import CircularJSON from 'circular-json';
import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import { ChildProcess } from 'child_process';
import { Context, Logger, LoadedPlugin, PluginOptions } from '@reactant/types';
import { sanitizeConfig } from '@reactant/config';
import {
  finish,
  processes,
  sanitizeContext,
  sanitizeJsonString
} from '@reactant/context/node';
import build from './build';
import clean from './clean';
import start from './start';
import storybook from './storybook';
import test from './test';

export async function cleanup(context: Context, logger: Logger) {
  logger.info('cleaning up ophaned processes');
  logger.info('please wait for this process to safely shutdown');
  Object.values(processes).map((ps: ChildProcess) => ps.kill('SIGINT'));
  await new Promise(resolve => setTimeout(resolve, 5000));
  Object.values(processes).map((ps: ChildProcess) => ps.kill('SIGKILL'));
  if (await fs.pathExists(path.resolve(__dirname, '../../../../lerna.json'))) {
    await fs.remove(path.resolve(__dirname, '../../../../../.tmp'));
    await fs.remove(
      path.resolve(__dirname, '../../../../packages/.tmp/reactant')
    );
    await fs.remove(
      path.resolve(__dirname, '../../../../packages/redux/.tmp/reactant')
    );
  }
  try {
    await fs.remove(context.paths.tmp);
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    await fs.unlink(path.resolve(context.paths.reactant, 'config.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    await fs.unlink(path.resolve(context.paths.reactant, 'context.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    await fs.unlink(path.resolve(context.paths.reactant, 'platform.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    await fs.unlink(path.resolve(context.paths.reactant, 'plugins.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  finish();
  process.exit();
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
  await fs.writeJson(
    path.resolve(context.paths.reactant, 'config.json'),
    context.config ? sanitizeConfig(context.config, context.paths.root) : null
  );
  await fs.writeJson(
    path.resolve(context.paths.reactant, 'context.json'),
    sanitizeContext(context)
  );
  await fs.writeJson(
    path.resolve(context.paths.reactant, 'platform.json'),
    sanitizeJsonString(
      CircularJSON.stringify(context.platform?.options || {}),
      context.paths.root
    )
  );
  await fs.writeJson(
    path.resolve(context.paths.reactant, 'plugins.json'),
    sanitizeJsonString(
      CircularJSON.stringify(
        Object.entries(context.plugins || {}).reduce(
          (
            plugins: { [key: string]: PluginOptions },
            [pluginName, plugin]: [string, LoadedPlugin]
          ) => {
            plugins[pluginName] = plugin.options || {};
            return plugins;
          },
          {}
        )
      ),
      context.paths.root
    )
  );
  if (await fs.pathExists(path.resolve(__dirname, '../../../../lerna.json'))) {
    await fs.remove(path.resolve(__dirname, '../../../../../.tmp'));
    await fs.remove(
      path.resolve(__dirname, '../../../../packages/.tmp/reactant')
    );
    await fs.remove(
      path.resolve(__dirname, '../../../../packages/redux/.tmp/reactant')
    );
    await fs.ensureSymlink(
      context.paths.reactant,
      path.resolve(__dirname, '../../../../../.tmp/reactant')
    );
    await fs.ensureSymlink(
      context.paths.reactant,
      path.resolve(__dirname, '../../../../packages/.tmp/reactant')
    );
    await fs.ensureSymlink(
      context.paths.reactant,
      path.resolve(__dirname, '../../../../packages/redux/.tmp/reactant')
    );
  }
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

export { build, clean, start, storybook, test };
