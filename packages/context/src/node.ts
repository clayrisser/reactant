import { parse, stringify } from 'flatted';
import { Config, Context, SyncContextCallback } from '@reactant/types';
import State from './state';
import bootstrap from './bootstrap';
import defaultContext from './defaultContext';
import merge from './merge';

export function requireDefault<T = any>(moduleName: string): T {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const required = require(moduleName);
  if (required.__esModule && required.default) return required.default;
  return required;
}

function postprocess(context: Context): Context {
  // TODO
  return context;
}

export const state = new State<Context>('context', postprocess);

export default function getContext(): Context {
  const context = state.state;
  return typeof context === 'undefined' ? defaultContext : context;
}

export function setContext(context: Context): Context {
  state.state = context;
  return getContext();
}

export function finish() {
  return state.finish();
}

export function syncContext(
  callback?: SyncContextCallback
): Context | Promise<Context> {
  const context = getContext();
  if (!callback) return context;
  if (
    // eslint-disable-next-line no-undef,no-restricted-globals
    callback?.constructor?.name === 'AsyncFunction' ||
    // eslint-disable-next-line no-undef,no-restricted-globals
    callback?.constructor?.name === 'Promise'
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(setContext(await callback(context)));
      } catch (err) {
        return reject(err);
      }
    });
  }
  return setContext(callback(context) as Context);
}

export function sanitizeJsonString(json: string, rootPath: string): string {
  return json.replace(
    new RegExp(`${rootPath.replace(/\//g, '/')}\\/?`, 'g'),
    ''
  );
}

export function sanitizeConfig(config: Config, rootPath?: string): Config {
  let configString = stringify(config);
  if (rootPath) configString = sanitizeJsonString(configString, rootPath);
  const sanitizedConfig: Config = parse(configString);
  return sanitizedConfig;
}

export function sanitizeContext(context: Context): Context {
  const contextString = sanitizeJsonString(
    stringify(context),
    context.paths.root
  );
  const sanitizedContext: Context = parse(contextString);
  sanitizedContext.paths.root = '.';
  if (context.config) {
    sanitizedContext.config = sanitizeConfig(
      context.config,
      context.paths.root
    );
  }
  sanitizedContext.state.sanitized = true;
  return sanitizedContext;
}

export { bootstrap, defaultContext, merge };
export * from './platform';
export * from './plugin';
export * from './processes';
export * from '@reactant/types/lib/context';
