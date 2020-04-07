// eslint-disable-next-line max-classes-per-file
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Command } from '@oclif/command';
import { Context, PluginAction, PlatformAction } from '@reactant/types';
import { Hook, Plugin, Command as ConfigCommand } from '@oclif/config';
import { Logger, runActions } from '@reactant/core';
import { registerActions } from '../actions';

let platformActions: PlatformAction[] = [];
let pluginActions: PluginAction[] = [];

export function createDynamicPlugin(
  hookContext: Hook.Context,
  commandName: string,
  context: Context
): Plugin {
  class DynamicPlugin extends Plugin {
    get hooks() {
      return {};
    }

    get topics() {
      return [];
    }

    get commandIDs() {
      return [commandName];
    }

    get commands(): ConfigCommand.Plugin[] {
      const cmd = class extends Command {
        static id = commandName;

        static load() {
          return cmd;
        }

        async run() {
          const logger = new Logger(context.logLevel);
          await runActions(context, logger, pluginActions, platformActions);
        }
      };
      // @ts-ignore
      return [cmd];
    }
  }
  return new DynamicPlugin(hookContext.config);
}

// eslint-disable-next-line func-names
const hook: Hook<'init'> = async function () {
  if (
    !(await fs.pathExists(
      path.resolve(pkgDir.sync(process.cwd()) || process.cwd(), 'package.json')
    ))
  ) {
    throw new Error('must run reactant from inside project');
  }
  [pluginActions, platformActions] = registerActions(
    (actionName: string, context: Context) => {
      this.config.plugins.push(createDynamicPlugin(this, actionName, context));
    }
  );
};

export default hook;
