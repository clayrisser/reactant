import { Context, SyncContextSyncCallback, SyncContextCallback } from './types';

export function syncContext(callback: SyncContextCallback): Promise<Context> {
  // TODO
  return callback(({} as unknown) as Context);
}

export function syncContextSync(callback: SyncContextSyncCallback): Context {
  // TODO
  return callback(({} as unknown) as Context);
}

export * from './types';
