import {
  createConfig as createEcosystemConfig,
  getConfig as getEcosystemConfig
} from '@ecosystem/config';
import defaultConfig from './defaultConfig';
import { CalculatePorts } from './ports';
import { Config, CONFIG_STATE } from './types';

export async function postProcess<T = Config>(_config: T): Promise<T> {
  const config: Config = (_config as unknown) as Config;
  if (!config[CONFIG_STATE].setPorts) {
    const calculatPorts = new CalculatePorts(config.ports, config.basePort);
    const basePort = await calculatPorts.getBasePort();
    const ports = await calculatPorts.getPorts();
    config.basePort = basePort;
    config.ports = ports;
    config[CONFIG_STATE].setPorts = true;
  }
  if (!config[CONFIG_STATE].setPaths) {
    config.paths.root = config.rootPath;
    config[CONFIG_STATE].setPaths = true;
  }
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
export * from './paths';
export * from './ports';
export * from './types';