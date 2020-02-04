// eslint-disable-next-line max-classes-per-file
import fs from 'fs-extra';
import path from 'path';
import { Command } from '@oclif/command';
import { Hook, Plugin, Command as ConfigCommand } from '@oclif/config';
import { Logger, runActions } from '@reactant/core';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import {
  Context,
  LoadedPlugin,
  PlatformAction,
  PluginAction
} from '@reactant/types';

const platformActions: PlatformAction[] = [];
const pluginActions: PluginAction[] = [];

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
const hook: Hook<'init'> = async function() {
  const commandsPath = path.resolve(__dirname, '../commands');
  const ignorePlatformActions = new Set(
    fs
      .readdirSync(commandsPath)
      .filter(
        (fileName: string) =>
          fs.pathExistsSync(path.resolve(commandsPath, fileName)) &&
          fileName.substr(fileName.length - 3) === '.js'
      )
      .map(fileName => fileName.substr(0, fileName.length - 3))
  );
  const registeredActionNames: Set<string> = new Set(ignorePlatformActions);

  const context = bootstrap(
    loadConfig(),
    process.argv?.[3],
    process.argv?.[2],
    {
      args: [],
      config: {},
      debug: false
    },
    (c: Context): Context => c,
    (c: Context): Context => c
  );
  if (context.platform) {
    Object.entries(context.platform.actions).forEach(
      ([actionName, platformAction]: [string, PlatformAction]) => {
        if (!registeredActionNames.has(actionName)) {
          platformActions.push(platformAction);
          registeredActionNames.add(actionName);
          this.config.plugins.push(
            createDynamicPlugin(this, actionName, context)
          );
        }
      }
    );
  }
  Object.values(context.plugins).forEach((plugin: LoadedPlugin) => {
    Object.entries(plugin.actions).forEach(
      ([actionName, pluginAction]: [string, PluginAction]) => {
        if (true /* valid action */) {
          pluginActions.push(pluginAction);
        }
        if (!registeredActionNames.has(actionName)) {
          registeredActionNames.add(actionName);
          this.config.plugins.push(
            createDynamicPlugin(this, actionName, context)
          );
        }
      }
    );
  });
};

export default hook;
