// eslint-disable-next-line max-classes-per-file
import { Command } from '@oclif/command';
import {
  Context,
  LoadedPlugin,
  PluginAction,
  TPluginApi
} from '@reactant/types';
import { Hook, Plugin, Command as ConfigCommand } from '@oclif/config';
import { Logger } from '@reactant/core';
import { bootstrap } from '@reactant/context/node';
import { loadConfig } from '@reactant/config/node';

export function createDynamicPlugin(
  hookContext: Hook.Context,
  commandName: string,
  action: PluginAction,
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
          return action(context, logger, {} as TPluginApi);
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
  const context = bootstrap(
    loadConfig(),
    undefined,
    undefined,
    {
      args: [],
      config: {},
      debug: false
    },
    (c: Context): Context => c,
    (c: Context): Context => c
  );
  Object.values(context.plugins).forEach((plugin: LoadedPlugin) => {
    Object.entries(plugin.actions).forEach(
      ([actionName, action]: [string, PluginAction]) => {
        this.config.plugins.push(
          createDynamicPlugin(this, actionName, action, context)
        );
      }
    );
  });
};

export default hook;
