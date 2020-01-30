import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import { Context, Logger, LoadedPlugin, PluginOptions } from '@reactant/types';
import { sanitizeConfig } from '@reactant/config';
import { stringify } from 'flatted';
import {
  finish,
  sanitizeContext,
  sanitizeJsonString
} from '@reactant/context/node';
import build from './build';
import clean from './clean';
import start from './start';
import storybook from './storybook';
import test from './test';

export function cleanup(context: Context, _logger: Logger) {
  if (
    fs.pathExistsSync(
      path.resolve(__dirname, '../../../../pnpm-workspace.yaml')
    )
  ) {
    fs.removeSync(path.resolve(__dirname, '../../../../../.tmp'));
    fs.removeSync(
      path.resolve(__dirname, '../../../../packages/.tmp/reactant')
    );
    fs.removeSync(
      path.resolve(__dirname, '../../../../packages/redux/.tmp/reactant')
    );
  }
  try {
    fs.removeSync(context.paths.tmp);
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    fs.unlinkSync(path.resolve(context.paths.reactant, 'config.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    fs.unlinkSync(path.resolve(context.paths.reactant, 'context.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    fs.unlinkSync(path.resolve(context.paths.reactant, 'platform.json'));
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    fs.unlinkSync(path.resolve(context.paths.reactant, 'plugins.json'));
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
      stringify(context.platform?.options || {}),
      context.paths.root
    )
  );
  await fs.writeJson(
    path.resolve(context.paths.reactant, 'plugins.json'),
    sanitizeJsonString(
      stringify(
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
  if (
    await fs.pathExists(
      path.resolve(__dirname, '../../../../pnpm-workspace.yaml')
    )
  ) {
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
  cleanup(context, logger);
  finish();
  return context;
}

export { build, clean, start, storybook, test };
