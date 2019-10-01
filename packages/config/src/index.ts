import {
  createConfigSync as createEcosystemConfigSync,
  getConfigSync as getEcosystemConfigSync,
  updateConfigSync as updateEcosystemConfigSync
} from '@ecosystem/config';
import defaultConfig from './defaultConfig';
import { CalculatePaths } from './paths';
import { CalculatePorts } from './ports';
import { Config, CONFIG_STATE } from './types';
import { preAction } from './action';

export function postProcessSync<T = Config>(_config: T): T {
  const config: Config = (_config as unknown) as Config;
  if (!config._ready) return (config as unknown) as T;
  if (!config[CONFIG_STATE].setPaths) {
    const calculatePaths = new CalculatePaths(
      config.paths,
      config.rootPath,
      config.platform
    );
    config.paths = calculatePaths.paths;
    config[CONFIG_STATE].setPaths = true;
  }
  config._ready = false;
  return (config as unknown) as T;
}

export async function postProcess<T = Config>(_config: T): Promise<T> {
  const config: Config = (_config as unknown) as Config;
  if (!config._ready) return (config as unknown) as T;
  if (!config[CONFIG_STATE].setPorts) {
    const calculatPorts = new CalculatePorts(config.ports, config.basePort);
    const basePort = await calculatPorts.getBasePort();
    const ports = await calculatPorts.getPorts();
    config.basePort = basePort;
    config.ports = ports;
    config[CONFIG_STATE].setPorts = true;
  }
  if (!config[CONFIG_STATE].setPaths) {
    const calculatePaths = new CalculatePaths(
      config.paths,
      config.rootPath,
      config.platform
    );
    config.paths = calculatePaths.paths;
    config[CONFIG_STATE].setPaths = true;
  }
  config._ready = false;
  await preAction(config);
  return (config as unknown) as T;
}

export async function preProcess<T = Config>(config: T): Promise<T> {
  return config;
}

export function preProcessSync<T = Config>(config: T): T {
  return config;
}

export function getConfig(): Config {
  return getEcosystemConfigSync<Config>(postProcess);
}

export function updateConfig(config: Config): Config {
  return updateEcosystemConfigSync<Config>(config, preProcess, postProcess);
}

export function createConfig(runtimeConfig: Partial<Config> = {}): Config {
  return createEcosystemConfigSync<Config>(
    'reactant',
    defaultConfig,
    runtimeConfig,
    preProcess,
    postProcess
  );
}

export { defaultConfig };
export * from './action';
export * from './paths';
export * from './ports';
export * from './types';
