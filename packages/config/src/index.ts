import { syncContext, Context } from '@reactant/context';
import { Config } from './types';

export * from './types';

export function loadUserConfig(): Partial<Config> {
  return {};
}

export function getConfig(): Config {
  return (syncContext() as Context).config;
}
