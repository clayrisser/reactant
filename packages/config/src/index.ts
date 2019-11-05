import pkgDir from 'pkg-dir';
import { Config, Context } from '@reactant/types';
import { cosmiconfigSync } from 'cosmiconfig';
import { getContext, merge, syncContext } from '@reactant/context';
import defaultConfig from './defaultConfig';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export function getUserConfig(): Partial<Config> {
  let userConfig: Partial<Config> = {};
  try {
    const payload = cosmiconfigSync('reactant').search(rootPath);
    // TODO
    userConfig = (payload && payload.config ? payload.config : {}) as Partial<
      Config
    >;
  } catch (err) {
    if (err.name !== 'YAMLException') throw err;
    // eslint-disable-next-line import/no-dynamic-require,global-require
    userConfig = require(err.mark.name);
  }
  return userConfig;
}

export function loadConfig(): Config {
  return merge<Config>(defaultConfig, getUserConfig());
}

export function getConfig(): Config {
  return (getContext() as Context).config || defaultConfig;
}

export function setConfig(config: Config, mergeConfig = true): Config {
  syncContext((context: Context) => {
    context.config = mergeConfig
      ? merge<Config>(context.config || defaultConfig, config)
      : config;
    return context;
  });
  return getConfig();
}

export default getConfig();
export { defaultConfig };
export * from '@reactant/types/lib/config';
