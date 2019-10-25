import { Context, SyncContextCallback } from './types';

const _context: Partial<Context> = {};

export function setContext(context: Partial<Context>): Context {
  // TODO
  Object.assign(_context, context);
  return (_context as unknown) as Context;
}

export function getContext(): Context {
  // TODO
  return (_context as unknown) as Context;
}

export function syncContext(
  callback: SyncContextCallback
): Context | Promise<Context> {
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
