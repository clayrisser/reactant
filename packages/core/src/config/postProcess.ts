import mergeConfiguration from 'merge-configuration';
import { CalculatePaths } from './paths';
import { CalculatePorts } from './ports';
import { getReactantPlatform } from '../platform';
import { getReactantPlugins } from '../plugin';
import { mapCraco } from './mapConfig';
import { preAction } from '../action';
import {
  Config,
  CalculatedPlatform,
  CalculatedPlugins,
  CalculatedPlugin
} from '../types';

const _postConfigCache: {
  platform: CalculatedPlatform | null;
  plugins: CalculatedPlugins | null;
} = {
  platform: null,
  plugins: null
};

export function postProcessSync<T = Config>(
  _config: T,
  initializing = false
): T {
  let config: Config = (_config as unknown) as Config;
  if (initializing || !_postConfigCache.platform || !_postConfigCache.plugins) {
    const platform = getReactantPlatform(config.platformName, config);
    _postConfigCache.platform = platform;
    config._platform = platform;
    const plugins = getReactantPlugins(config);
    _postConfigCache.plugins = plugins;
  }
  config._platform = _postConfigCache.platform;
  config._plugins = _postConfigCache.plugins;
  if (typeof config._platform.config === 'function') {
    config = config._platform.config(config, config._platform.options);
  } else if (
    config._platform.config &&
    typeof config._platform.config === 'object'
  ) {
    config = mergeConfiguration<Config>(config, config._platform.config);
  }
  Object.entries(config._plugins).forEach(
    ([_pluginName, plugin]: [string, CalculatedPlugin]) => {
      if (typeof plugin.config === 'function') {
        config = plugin.config(config, config._platform.options);
      } else if (config._platform.config && typeof plugin.config === 'object') {
        config = mergeConfiguration<Config>(config, plugin.config);
      }
    }
  );
  config.craco = mapCraco(config);
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
