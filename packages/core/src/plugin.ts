import { Context } from '@reactant/context';
import { Plugin, Plugins } from '@reactant/plugin';

export async function loadPlugins(context: Context): Promise<Plugins> {
  // TODO
  return (context as unknown) as Plugins;
}

export async function loadPlugin(context: Context): Promise<Plugin> {
  // TODO
  return (context as unknown) as Plugin;
}
