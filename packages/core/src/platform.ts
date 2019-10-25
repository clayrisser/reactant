import { Context } from '@reactant/context';
import { Platform } from '@reactant/platform';

export async function loadPlatform(_context: Context): Promise<Platform> {
  // TODO 1
  return ({ config: (f: any) => f } as unknown) as Platform;
}
