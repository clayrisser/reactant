import lib, { setConfig, sanitizeConfig } from '../lib';

export default function getConfig() {
  try {
    const config = lib();
    if (config) return config;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    // eslint-disable-next-line global-require
    const config = require('@reactant/_config');
    if (config) return config;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  const g = window || global || {};
  if (g.__REACTANT__ && g.__REACTANT__.config) return g.__REACTANT__.config;
  return null;
}

export { setConfig, sanitizeConfig };
