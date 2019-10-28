import State from './state';
import { Context, SyncContextCallback } from './types';

export function postprocess(context: Context): Context {
  return context;
}

const state = new State<Partial<Context>>('context', postprocess);

export function getContext(): Context {
  return (state.state as unknown) as Context;
}

export function setContext(context: Partial<Context>): Context {
  state.state = context;
  return getContext();
}

export function syncContext(
  callback?: SyncContextCallback
): Context | Promise<Context> {
  if (!callback) return getContext() as Context;
  if (
    // eslint-disable-next-line no-undef,no-restricted-globals
    callback?.constructor?.name === 'AsyncFunction' ||
    // eslint-disable-next-line no-undef,no-restricted-globals
    callback?.constructor?.name === 'Promise'
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        return setContext(await callback(getContext()));
      } catch (err) {
        return reject(err);
      }
    });
  }
  return setContext(callback(getContext()) as Context);
}

export * from './types';
