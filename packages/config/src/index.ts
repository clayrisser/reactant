import { syncContext, Context } from '@reactant/context';
import mergeConfiguration from './mergeConfiguration';
import defaultConfig from './defaultConfig';
import { Config } from './types';

export * from './types';

export function loadUserConfig(): Partial<Config> {
  return {};
}

export function loadConfig(): Config {
  return mergeConfiguration<Config>(defaultConfig, loadUserConfig());
}

export function getConfig(): Config {
  return (syncContext() as Context).config;
}
