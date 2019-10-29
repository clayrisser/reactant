import { Context, Platform } from '@reactant/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function loadPlatform(_context: Context): Platform {
  // TODO 1
  return ({ config: (f: any) => f } as unknown) as Platform;
}
