import { Context, Platform } from '@reactant/types';

export async function loadPlatform(_context: Context): Promise<Platform> {
  // TODO 1
  return ({ config: (f: any) => f } as unknown) as Platform;
}
