import CircularJSON from 'circular-json';
import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import { ChildProcess } from 'child_process';
import { Context, Logger, LoadedPlugin, PluginOptions } from '@reactant/types';
import { finish, processes } from '@reactant/context';
import build from './build';
import clean from './clean';
import start from './start';
import storybook from './storybook';

export async function cleanup(context: Context, _logger: Logger) {
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
  await fs.writeFile(
    path.resolve(context.paths.reactant, 'config.json'),
    CircularJSON.stringify(context.config)
  );
  await fs.writeFile(
    path.resolve(context.paths.reactant, 'platform.json'),
    CircularJSON.stringify(context.platform?.options || {})
  );
  await fs.writeFile(
    path.resolve(context.paths.reactant, 'plugins.json'),
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

export { build, clean, start, storybook };
