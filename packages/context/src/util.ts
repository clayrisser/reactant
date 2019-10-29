export function requireDefault<T = any>(moduleName: string): T {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const required = require(moduleName);
  if (required.__esModule && required.default) return required.default;
  return required;
}
