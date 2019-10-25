import { Context } from '@reactant/context';
import { Platform } from '@reactant/platform';

export async function loadPlatform(context: Context): Promise<Platform> {
  // TODO
  return (context as unknown) as Platform;
}
