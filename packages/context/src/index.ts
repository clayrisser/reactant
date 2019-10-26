import State from './state'
import { Context, SyncContextCallback } from './types';

const state = new State<Partial<Context>>()

export function setContext(context: Partial<Context>): Context {
  // TODO
  Object.assign(state.context, context);
  return (state.context as unknown) as Context;
}

export function getContext(): Context {
  // TODO
  return (state.context as unknown) as Context;
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
