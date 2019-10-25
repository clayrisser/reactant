import fs from 'fs-extra';

export function resolvePath(name, nextName) {
  let path = name;
  try {
    path = require.resolve(name);
  } catch (err) {
    if (nextName) path = resolvePath(nextName);
  }
  if (!fs.existsSync(path) && nextName) return resolvePath(nextName);
  return path;
}

export default { resolvePath };
