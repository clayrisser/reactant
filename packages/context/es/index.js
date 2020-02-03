import lib, { merge, setContext, syncContext, sanitizeContext } from '../lib';

export default function getContext() {
  try {
    // eslint-disable-next-line global-require
    const context = lib();
    if (context) return context;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  try {
    // eslint-disable-next-line global-require
    const context = require('@reactant/_context');
    if (context) return context;
    // eslint-disable-next-line no-empty
  } catch (err) {}
  const g = window || global || {};
  if (g.__REACTANT__ && g.__REACTANT__.context) return g.__REACTANT__.context;
  return null;
}

export { merge, setContext, syncContext, sanitizeContext };
