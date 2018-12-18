import path from 'path';
import pkgDir from 'pkg-dir';

export default function resolve(packageName, dirname = __dirname, paths = []) {
  return require.resolve(packageName, {
    paths: [
      path.resolve(pkgDir.sync(process.cwd()), 'node_modules'),
      path.resolve(pkgDir.sync(dirname), 'node_modules'),
      ...paths
    ]
  });
}

export function req(...props) {
  const pkg = resolve(...props);
  if (pkg.__esModule) return pkg.default;
  return pkg;
}
