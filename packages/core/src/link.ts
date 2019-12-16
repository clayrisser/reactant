import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';

const rootPath = path.resolve(__dirname, '../../..');

export interface DependenciesMap {
  [key: string]: string;
}

export interface ExamplesMap {
  [key: string]: string[];
}

function getDependenciesMap(): DependenciesMap {
  const packagesPath = path.resolve(rootPath, 'packages');
  const packageNames = fs
    .readdirSync(path.resolve(rootPath, 'packages'))
    .reduce((packages: string[], packageName: string) => {
      if (
        packageName.length &&
        packageName[0] !== '.' &&
        packageName[0] !== '_'
      ) {
        packages.push(packageName);
      }
      return packages;
    }, []);
  return [
    ...new Set(
      packageNames
        .map((packageName: string) => {
          if (
            !packageName.length ||
            packageName[0] === '.' ||
            packageName[0] === '_'
          ) {
            return [];
          }
          return Object.keys(
            fs.readJsonSync(
              path.resolve(packagesPath, packageName, 'package.json')
            ).dependencies || {}
          );
        })
        .flat()
    )
  ].reduce((dependencies: DependenciesMap, dependency: string) => {
    try {
      dependencies[dependency] = pkgDir.sync(
        require.resolve(dependency, {
          paths: packageNames.map((packageName: string) =>
            path.resolve(packagesPath, packageName, 'node_modules')
          )
        })
      )!;
      // eslint-disable-next-line no-empty
    } catch (_err) {
      const packagePath = packageNames.reduce(
        (packagePath: string, packageName: string) => {
          packagePath = path.resolve(
            packagesPath,
            packageName,
            'node_modules',
            dependency
          );
          if (packagePath.length || fs.existsSync(packagePath)) {
            return packagePath;
          }
          return '';
        },
        ''
      );
      if (packagePath.length) dependencies[dependency] = packagePath;
    }
    return dependencies;
  }, {});
}

function getExamplesMap() {
  const exampleNames = fs
    .readdirSync(path.resolve(rootPath, 'examples'))
    .reduce((packages: string[], packageName: string) => {
      if (
        packageName.length &&
        packageName[0] !== '.' &&
        packageName[0] !== '_'
      ) {
        packages.push(packageName);
      }
      return packages;
    }, []);
  return exampleNames.reduce(
    (examplesMap: ExamplesMap, exampleName: string) => {
      const pkg = fs.readJsonSync(
        path.resolve(rootPath, 'examples', exampleName, 'package.json')
      );
      examplesMap[exampleName] = [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {})
      ];
      return examplesMap;
    },
    {}
  );
}

if (fs.pathExistsSync(path.resolve(rootPath, 'lerna.json'))) {
  const examplesMap = getExamplesMap();
  const dependenciesMap = getDependenciesMap();
  Object.entries(examplesMap).forEach(
    ([exampleName, exampleDependenciesNames]: [string, string[]]) => {
      Object.entries(dependenciesMap).forEach(
        ([dependencyName, dependencyPath]: [string, string]) => {
          const exampleDependencyPath = path.resolve(
            rootPath,
            'examples',
            exampleName,
            'node_modules',
            dependencyName
          );
          if (
            !exampleDependenciesNames.includes(dependencyName) &&
            !fs.existsSync(exampleDependencyPath)
          ) {
            // eslint-disable-next-line no-console
            console.log(`${dependencyPath} -> ${exampleDependencyPath}`);
            fs.mkdirsSync(exampleDependencyPath);
            fs.removeSync(exampleDependencyPath);
            fs.symlinkSync(dependencyPath, exampleDependencyPath);
          }
        }
      );
    }
  );
}
