import { Config, Context } from '@reactant/types';
import { getContext, merge, syncContext } from '@reactant/context';
import defaultConfig from './defaultConfig';

// eslint-disable-next-line no-new-func
const isNode = new Function(
  'try{return this===global}catch(e){return false}'
)();

export function getUserConfig(): Partial<Config> {
  // eslint-disable-next-line no-eval
  const pkgDir = eval("require('pkg-dir')");
  // eslint-disable-next-line no-eval
  const { cosmiconfigSync } = eval("require('cosmiconfig')");
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
    // eslint-disable-next-line import/no-dynamic-require,global-require
    userConfig = require(err.mark.name);
  }
  return userConfig;
}

export function loadConfig(): Config {
  if (!isNode) throw new Error('only node can load config');
  return merge<Config>(defaultConfig, getUserConfig());
}

export function getConfig(): Config {
  if (isNode) return (getContext() as Context).config || defaultConfig;
  if (window.__REACTANT__?.config) return window.__REACTANT__.config;
  return { ...defaultConfig };
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
