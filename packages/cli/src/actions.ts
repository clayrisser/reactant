import fs from 'fs-extra';
import path from 'path';
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
let registered = false;

function getContext() {
  return bootstrap(
    loadConfig(),
    process.argv?.slice(3).find((arg: string) => arg.length && arg[0] !== '-'),
    process.argv?.slice(2).find((arg: string) => arg.length && arg[0] !== '-'),
    {
      args: [],
      config: {},
      debug: false
    },
    (c: Context): Context => c,
    (c: Context): Context => c
  );
}

export function registerActions(
  registerActionName: (actionName: string, context: Context) => void = (
    _actionName: string
  ) => {}
): [PluginAction[], PlatformAction[]] {
  if (registered) return [pluginActions, platformActions];
  const context = getContext();
  const commandsPath = path.resolve(__dirname, './commands');
  const ignorePlatformActions = new Set(
    fs
      .readdirSync(commandsPath)
      .filter(
        (fileName: string) =>
          fs.pathExistsSync(path.resolve(commandsPath, fileName)) &&
          fileName.substr(fileName.length - 3) === '.js'
      )
      .map((fileName) => fileName.substr(0, fileName.length - 3))
  );
  const registeredActionNames: Set<string> = new Set(ignorePlatformActions);
  if (context.platform) {
    Object.entries(context.platform.actions).forEach(
      ([actionName, platformAction]: [string, PlatformAction]) => {
        if (
          (!context.action.length || context.action === actionName) &&
          !registeredActionNames.has(actionName)
        ) {
          platformActions.push(platformAction);
          registeredActionNames.add(actionName);
          registerActionName(actionName, context);
        }
      }
    );
  }
  Object.values(context.plugins).forEach((plugin: LoadedPlugin) => {
    Object.entries(plugin.actions).forEach(
      ([actionName, pluginAction]: [string, PluginAction]) => {
        if (!context.action.length || context.action === actionName) {
          pluginActions.push(pluginAction);
          if (!registeredActionNames.has(actionName)) {
            registeredActionNames.add(actionName);
            registerActionName(actionName, context);
          }
        }
      }
    );
  });
  registered = true;
  return [pluginActions, platformActions];
}
