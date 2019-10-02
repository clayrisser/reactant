import { Config } from '@reactant/types';

export async function preProcess<T = Config>(config: T): Promise<T> {
  return config;
}

export function preProcessSync<T = Config>(config: T): T {
  return config;
}
