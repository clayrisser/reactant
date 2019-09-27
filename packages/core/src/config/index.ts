import { getConfig as getEcosystemConfig } from '@ecosystem/config';
import defaultConfig from './defaultConfig';
import { Config } from './types';

export async function getConfig(): Promise<Config> {
  return getEcosystemConfig<Config>();
}

export { defaultConfig };
export * from './paths';
export * from './ports';
export * from './types';
