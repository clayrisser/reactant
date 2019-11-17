import { Config, Context } from '@reactant/types';
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
    // eslint-disable-next-line import/no-dynamic-require,global-require,no-eval
    userConfig = eval(`require(${err.mark.name})`);
  }
  return userConfig;
}

export function loadConfig(): Config {
  if (!isNode) throw new Error('only node can load config');
  // eslint-disable-next-line no-eval
  const { merge } = eval("require('@reactant/context')");
  return merge(defaultConfig, getUserConfig());
}

export function getConfig(): Config {
  if (isNode) {
    // eslint-disable-next-line no-eval
    const { getContext } = eval("require('@reactant/context')");
    return (getContext() as Context).config || defaultConfig;
  }
  try {
    // eslint-disable-next-line global-require
    const config: Config = require('../../../../.tmp/reactant/config.json');
    if (config) return config;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  if (window.__REACTANT__?.config) return window.__REACTANT__.config;
  return { ...defaultConfig };
}

export function setConfig(config: Config, mergeConfig = true): Config {
  if (!isNode) throw new Error('only node can set config');
  // eslint-disable-next-line no-eval
  const { merge, syncContext } = eval("require('@reactant/context')");
  syncContext((context: Context) => {
    context.config = mergeConfig
      ? merge(context.config || defaultConfig, config)
      : config;
    return context;
  });
  return getConfig();
}

export default getConfig();
export { defaultConfig };
export * from '@reactant/types/lib/config';
