import { Config } from '@reactant/types';

const NOT_NODE_ERROR = new Error('only node can set config');
// eslint-disable-next-line no-new-func
const isNode = new Function(
  'try{return this===global}catch(e){return false}'
)();

export default function getConfig(): Config {
  // eslint-disable-next-line no-eval
  if (isNode) eval("require('./node')").default();
  try {
    // eslint-disable-next-line global-require
    const config: Config = require('../../../../.tmp/reactant/config.json');
    if (config) return config;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  if (window.__REACTANT__?.config) return window.__REACTANT__.config;
  return (null as unknown) as Config;
}

export function setConfig(config: Config, mergeConfig = true): Config {
  // eslint-disable-next-line no-eval
  if (isNode) eval("require('./node')").setConfig(config, mergeConfig);
  throw NOT_NODE_ERROR;
}

export function sanitizeConfig(config: Config, rootPath?: string): Config {
  // eslint-disable-next-line no-eval
  if (isNode) eval("require('./node')").sanitizeConfig(config, rootPath);
  return config;
}

export * from '@reactant/types/lib/config';
