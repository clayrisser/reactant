import {
  createConfigSync as createEcosystemConfigSync,
  getConfigSync as getEcosystemConfigSync,
  updateConfigSync as updateEcosystemConfigSync,
  finishSync as ecosystemFinishSync
} from '@ecosystem/config';
import defaultConfig from './defaultConfig';
import mapCraco from './mapCraco';
import { Config } from './types';
import { postProcessSync } from './postProcess';
import { preProcessSync } from './preProcess';

export function reduceConfig(config: Config): Config {
  return Object.entries(config).reduce(
    (config: Partial<Config>, [key, value]: [string, any]) => {
      if (key[0] !== '_') config[key] = value;
      return config;
    },
    {}
  ) as Config;
}

export function getConfig(): Config {
  return reduceConfig(
    getEcosystemConfigSync<Config>('reactant', postProcessSync)
  );
}

export function updateConfig(config: Config): Config {
  return reduceConfig(
    updateEcosystemConfigSync<Config>(
      'reactant',
      config,
      preProcessSync,
      postProcessSync
    )
  );
}

export function createConfig(runtimeConfig: Partial<Config> = {}): Config {
  return reduceConfig(
    createEcosystemConfigSync<Config>(
      'reactant',
      defaultConfig,
      runtimeConfig,
      preProcessSync,
      postProcessSync
    )
  );
}

export function finish() {
  return ecosystemFinishSync();
}

export { defaultConfig, mapCraco };
export * from './action';
export * from './paths';
export * from './ports';
export * from './postProcess';
export * from './preProcess';
export * from './types';
