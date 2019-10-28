import cosmiconfig from 'cosmiconfig';
import pkgDir from 'pkg-dir';
import { syncContext, Context } from '@reactant/context';
import defaultConfig from './defaultConfig';
import mergeConfiguration from './mergeConfiguration';
import { Config } from './types';

const rootPath = pkgDir.sync(process.cwd()) || process.cwd();

export function getUserConfig(): Partial<Config> {
  let userConfig: Partial<Config> = {};
  try {
    const payload = cosmiconfig('reactant').searchSync(rootPath);
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
  return mergeConfiguration<Config>(defaultConfig, getUserConfig());
}

export function getConfig(): Config {
  return (syncContext() as Context).config;
}

export function setConfig(config: Config, merge = true): Config {
  syncContext((context: Context) => {
    context.config = merge
      ? mergeConfiguration<Config>(context.config, config)
      : config;
    return context.config;
  });
  return getConfig();
}

export default getConfig();

export * from './types';
