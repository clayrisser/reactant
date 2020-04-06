import getContext, {
  merge,
  sanitizeConfig as contextSanitizeConfig,
  syncContext,
} from '@reactant/context/node';
import pkgDir from 'pkg-dir';
import { Config, Context } from '@reactant/types';
import { cosmiconfigSync } from 'cosmiconfig';
import defaultConfig from './defaultConfig';

export function getUserConfig(): Partial<Config> {
  const rootPath = pkgDir.sync(process.cwd()) || process.cwd();
  let userConfig: Partial<Config> = {};
  try {
    const payload = cosmiconfigSync('reactant').search(rootPath);
    // TODO
    userConfig = (payload && payload.config ? payload.config : {}) as Partial<
      Config
    >;
  } catch (err) {
    if (err.name !== 'YAMLException') throw err;
    // eslint-disable-next-line import/no-dynamic-require,global-require,no-eval
    userConfig = eval(`require(${err.mark.name})`);
  }
  return userConfig;
}

export function loadConfig(): Config {
  return merge(defaultConfig, getUserConfig());
}

export default function getConfig(): Config {
  return (getContext() as Context).config || defaultConfig;
}

export function setConfig(config: Config, mergeConfig = true): Config {
  syncContext((context: Context) => {
    context.config = mergeConfig
      ? merge(context.config || defaultConfig, config)
      : config;
    return context;
  });
  return getConfig();
}

export function sanitizeConfig(config: Config, rootPath?: string): Config {
  return contextSanitizeConfig(config, rootPath);
}

export { defaultConfig };
export * from '@reactant/types/lib/config';
