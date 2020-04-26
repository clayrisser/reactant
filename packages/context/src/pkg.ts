import path from 'path';
import fs, { Dirent } from 'fs-extra';
import { Pkg, Dependencies } from '@reactant/types';
import merge from './merge';

export function getPkg(rootPath: string, platformName?: string): Pkg {
  const pkgPath = path.resolve(rootPath, 'package.json');
  const pkg: Pkg = fs.readJsonSync(pkgPath);
  if (!platformName) {
    const platformPkgPaths = fs
      .readdirSync(path.resolve(rootPath), {
        withFileTypes: true
      })
      .filter((dirent: Dirent) => dirent.isDirectory())
      .reduce((platformPkgPaths: string[], dirent: Dirent) => {
        const platformPkgPath = path.resolve(
          rootPath,
          dirent.name,
          'package.json'
        );
        if (fs.pathExistsSync(platformPkgPath)) {
          platformPkgPaths.push(platformPkgPath);
        }
        return platformPkgPaths;
      }, []);

    platformPkgPaths.map((platformPkgPath: string) => {
      if (fs.pathExistsSync(platformPkgPath)) {
        const platformPkg: Pkg = fs.readJsonSync(platformPkgPath);
        mergeDependencies(pkg, platformPkg);
      }
    });
  } else {
    const platformPkgPath = path.resolve(
      rootPath,
      platformName,
      'package.json'
    );
    if (fs.pathExistsSync(platformPkgPath)) {
      const platformPkg = fs.readJsonSync(platformPkgPath);
      mergeDependencies(pkg, platformPkg);
    }
  }
  return pkg;
}

export function getReactantDependencies(dependencies: Dependencies) {
  return Object.entries(dependencies).reduce(
    (dependencies: Dependencies, [dependency, version]: [string, string]) => {
      if (dependency.substr(0, 10) === '@reactant/') {
        dependencies[dependency] = version;
      }
      return dependencies;
    },
    {}
  );
}

export function mergeDependencies(pkg: Pkg, newPkg: Partial<Pkg>): Pkg {
  pkg.dependencies = merge(pkg.dependencies || {}, newPkg.dependencies || {});
  pkg.devDependencies = merge(
    pkg.devDependencies || {},
    newPkg.devDependencies || {}
  );
  pkg.peerDependencies = merge(
    pkg.peerDependencies || {},
    newPkg.peerDependencies || {}
  );
  return pkg;
}
