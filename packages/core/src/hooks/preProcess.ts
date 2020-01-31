import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import { Context, Logger, LoadedPlugin, PluginOptions } from '@reactant/types';
import { parse, stringify } from 'flatted';
import { sanitizeConfig } from '@reactant/config';
import { sanitizeContext, sanitizeJsonString } from '@reactant/context/node';
import cleanup from './cleanup';

export default async function preProcess(
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
    parse(
      sanitizeJsonString(
        stringify(context.platform?.options || {}),
        context.paths.root
      )
    )
  );
  await fs.writeJson(
    path.resolve(context.paths.reactant, 'plugins.json'),
    parse(
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
    )
  );
  await fs.writeJson(
    path.resolve(context.paths.reactant, 'tsconfig.reactant.json'),
    {
      compilerOptions: {
        baseUrl: '../..',
        paths: {
          '*': ['web/node_modules/*']
        }
      },
      include: ['src', ...context.platformNames]
    }
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
