import { Context, SyncContextCallback } from '@reactant/types';
import State from './state';
import bootstrap from './bootstrap';
import defaultContext from './defaultContext';
import merge from './merge';

function postprocess(context: Context): Context {
  // TODO
  return context;
}

export const state = new State<Context>('context', postprocess);

export function getContext(): Context {
  const context = state.state;
  return typeof context === 'undefined' ? defaultContext : context;
}

export function setContext(context: Context): Context {
  state.state = context;
  return getContext();
}

export function finish() {
  return state.finish();
}

export function syncContext(
  callback?: SyncContextCallback
): Context | Promise<Context> {
  const context = getContext();
  if (!callback) return context;
  if (
    // eslint-disable-next-line no-undef,no-restricted-globals
    callback?.constructor?.name === 'AsyncFunction' ||
    // eslint-disable-next-line no-undef,no-restricted-globals
    callback?.constructor?.name === 'Promise'
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(setContext(await callback(context)));
      } catch (err) {
        return reject(err);
      }
    });
  }
  return setContext(callback(context) as Context);
}

export { bootstrap, defaultContext, merge };
export * from './platform';
export * from './plugin';
export * from './processes';
export * from '@reactant/types/lib/context';
export default getContext();
