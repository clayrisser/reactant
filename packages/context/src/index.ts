import { Context, SyncContextCallback } from '@reactant/types';
import defaultContext from './defaultContext';
import State from './state';

export function postprocess(context: Context): Context {
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
  return getContext() as Context;
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
