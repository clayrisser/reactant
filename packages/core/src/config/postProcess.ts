import { CalculatePaths } from './paths';
import { CalculatePorts } from './ports';
import { Config, CalculatedPlatform } from '../types';
import { getReactantPlatform } from '../platform';
import { mapCraco } from './mapConfig';
import { preAction } from '../action';

const _postConfigCache: { platform: CalculatedPlatform | null } = {
  platform: null
};

export function postProcessSync<T = Config>(
  _config: T,
  initializing = false
): T {
  const config: Config = (_config as unknown) as Config;
  config.craco = mapCraco(config);
  if (initializing || !_postConfigCache.platform) {
    const platform = getReactantPlatform(config.platformName, config);
    _postConfigCache.platform = platform;
  }
  config.platform = _postConfigCache.platform;
  return (config as unknown) as T;
}

export async function postProcess<T = Config>(_config: T): Promise<T> {
  let config: Config = (_config as unknown) as Config;
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
      config.platformName,
      config.action
    );
    config.paths = calculatePaths.paths;
    config._state.setPaths = true;
  }
  config = postProcessSync<Config>(config, true);
  config._state.initialized = true;
  await preAction(config);
  return (config as unknown) as T;
}
