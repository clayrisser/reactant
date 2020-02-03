// eslint-disable-next-line max-classes-per-file
import fs from 'fs-extra';
import path from 'path';
import { Command } from '@oclif/command';
import { Hook, Plugin, Command as ConfigCommand } from '@oclif/config';
import { Logger } from '@reactant/core';
import { PlatformApi } from '@reactant/platform';
import { PluginApi } from '@reactant/plugin';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';
import {
  Context,
  LoadedPlugin,
  PlatformAction,
  PluginAction
} from '@reactant/types';

export function createDynamicPlugin(
  hookContext: Hook.Context,
  commandName: string,
  {
    pluginAction,
    platformAction
  }: { pluginAction?: PluginAction; platformAction?: PlatformAction },
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
      const logger = new Logger(context.logLevel);

      const cmd = class extends Command {
        static id = commandName;

        static load() {
          return cmd;
        }

        async run() {
          if (pluginAction) {
            const pluginApi = new PluginApi(context, logger);
            return pluginAction(context, logger, pluginApi);
          }
          if (platformAction) {
            const platformApi = new PlatformApi(context, logger);
            return platformAction(context, logger, platformApi);
          }
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
  const ignoreActions = new Set(
    fs
      .readdirSync(commandsPath)
      .filter(
        (fileName: string) =>
          fs.pathExistsSync(path.resolve(commandsPath, fileName)) &&
          fileName.substr(fileName.length - 3) === '.js'
      )
      .map(fileName => fileName.substr(0, fileName.length - 3))
  );
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
        if (!ignoreActions.has(actionName)) {
          ignoreActions.add(actionName);
          this.config.plugins.push(
            createDynamicPlugin(this, actionName, { platformAction }, context)
          );
        }
      }
    );
  }
  Object.values(context.plugins).forEach((plugin: LoadedPlugin) => {
    Object.entries(plugin.actions).forEach(
      ([actionName, pluginAction]: [string, PluginAction]) => {
        if (!ignoreActions.has(actionName)) {
          ignoreActions.add(actionName);
          this.config.plugins.push(
            createDynamicPlugin(this, actionName, { pluginAction }, context)
          );
        }
      }
    );
  });
};

export default hook;
