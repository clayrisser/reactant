import {
  createConfig as createEcosystemConfig,
  getConfig as getEcosystemConfig
} from '@ecosystem/config';
import { CalculatePorts } from './ports';
import defaultConfig from './defaultConfig';
import { Config } from './types';

export async function postProcess<T = Config>(_config: T): Promise<T> {
  const config: Config = (_config as unknown) as Config;
  if (!config._state.setPorts) {
    const calculatPorts = new CalculatePorts(config.ports, config.basePort);
    const basePort = await calculatPorts.getBasePort();
    const ports = await calculatPorts.getPorts();
    config.basePort = basePort;
    config.ports = ports;
    config._state.setPorts = true;
  }
  if (!config._state.setPaths) {
    config.paths.root = config.rootPath;
    config._state.setPaths = true;
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
  console.log('postProcess', postProcess);
  const config = await createEcosystemConfig<Config>(
    'reactant',
    defaultConfig,
    runtimeConfig,
    preProcess,
    postProcess
  );
  return config;
}

export { defaultConfig };
export * from './paths';
export * from './ports';
export * from './types';
