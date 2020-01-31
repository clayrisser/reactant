import { Context, SyncContextCallback } from '@reactant/types';
import { MergeModifier, MergeOptions } from './types';

// eslint-disable-next-line no-new-func
const isNode = new Function(
  'try{return this===global}catch(e){return false}'
)();

function createNodeError(action: string) {
  return new Error(`only node can ${action}`);
}

export function merge<Config>(
  config: Config,
  modifier: Partial<Config> | MergeModifier,
  partialOptions: Partial<MergeOptions> = {},
  ...args: any[]
): Config {
  if (isNode) {
    // eslint-disable-next-line no-eval
    return eval("require('./merge')").default(
      config,
      modifier,
      partialOptions,
      ...args
    );
  }
  throw createNodeError('merge config');
}

export function setContext(context: Context): Context {
  // eslint-disable-next-line no-eval
  if (isNode) return eval("require('./node')").setContext(context);
  throw createNodeError('set context');
}

export function syncContext(
  callback?: SyncContextCallback
): Context | Promise<Context> {
  // eslint-disable-next-line no-eval
  if (isNode) return eval("require('./node')").syncContext(callback);
  throw createNodeError('sync context');
}

export function sanitizeContext(context: Context): Context {
  // eslint-disable-next-line no-eval
  if (isNode) return eval("require('./node')").sanitizeContext(context);
  return context;
}

export default function getContext(): Context {
  // eslint-disable-next-line no-eval
  if (isNode) return eval("require('./node')").default();
  try {
    // eslint-disable-next-line global-require
    const context: Context = require('../../../.tmp/reactant/context.json');
    if (context) return context;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  if (window.__REACTANT__?.context) return window.__REACTANT__.context;
  return (null as unknown) as Context;
}

export * from '@reactant/types/lib/context';
