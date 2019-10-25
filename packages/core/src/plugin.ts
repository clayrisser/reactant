import { Context } from '@reactant/context';
import { Plugin, Plugins } from '@reactant/plugin';

export async function loadPlugins(_context: Context): Promise<Plugins> {
  // TODO 3
  return ({} as unknown) as Plugins;
}

export async function loadPlugin(_context: Context): Promise<Plugin> {
  // TODO 2
  return ({} as unknown) as Plugin;
}
