import { getReactantPlatform } from '@reactant/platform';
import { CalculatePaths } from './paths';
import { CalculatePorts } from './ports';
import { Config } from './types';
import { preAction } from './action';
import mapCraco from './mapCraco';

export function postProcessSync<T = Config>(_config: T): T {
  const config: Config = (_config as unknown) as Config;
  config.craco = mapCraco(config);
  config.platform = getReactantPlatform(config.platformName, config);
  return (config as unknown) as T;
}

export async function postProcess<T = Config>(_config: T): Promise<T> {
  const config: Config = (_config as unknown) as Config;
  if (!config._state.ready || config._state.initialized) {
    return postProcessSync<T>((config as unknown) as T);
  }
  if (!config._state.setPorts) {
    const calculatPorts = new CalculatePorts(config.ports, config.basePort);
    const basePort = await calculatPorts.getBasePort();
    const ports = await calculatPorts.getPorts();
    config.basePort = basePort;
    config.ports = ports;
    config._state.setPorts = true;
  }
  if (!config._state.setPaths) {
    const calculatePaths = new CalculatePaths(
      config.paths,
      config.rootPath,
      config.platformName
    );
    config.paths = calculatePaths.paths;
    config._state.setPaths = true;
  }
  await preAction(config);
  config._state.initialized = true;
  return postProcessSync<T>((config as unknown) as T);
}
