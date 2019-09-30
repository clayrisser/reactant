import {
  createConfig as createEcosystemConfig,
  getConfig as getEcosystemConfig
} from '@ecosystem/config';
import defaultConfig from './defaultConfig';
import { CalculatePaths } from './paths';
import { CalculatePorts } from './ports';
import { Config, CONFIG_STATE } from './types';
import { preAction } from './action';

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

export async function getConfig(): Promise<Config> {
  return getEcosystemConfig<Config>(postProcess);
}

export async function createConfig(
  runtimeConfig: Partial<Config> = {}
): Promise<Config> {
  return createEcosystemConfig<Config>(
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
