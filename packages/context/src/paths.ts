import path from 'path';
import { Paths } from '@reactant/types';

export interface Vars {
  [key: string]: string;
}

export interface VarMap {
  [key: string]: string;
}

export class CalculatePaths {
  private vars: Vars;

  private unparsedPaths: Paths;

  constructor(
    paths: Paths,
    private rootPath: string,
    platformName: string,
    actionName: string,
    masterPid: number
  ) {
    this.unparsedPaths = paths;
    this.vars = {
      ...paths,
      _action: actionName,
      _masterPid: masterPid.toString(),
      _platform: platformName,
    };
  }

  get paths(): Paths {
    return Object.entries(this.unparsedPaths).reduce(
      (paths: Paths, [key, path]: [string, string]) => {
        if (!Object.keys(paths).includes(key)) {
          paths[key] = this.resolve(path);
        }
        return paths;
      },
      {} as Paths
    );
  }

  getVarMap(path: string): VarMap {
    const regex = /{(([^{/])|(\\\/)|(\\{))+}/g;
    const matches = path.match(regex);
    if (!matches || !matches.length) return {} as VarMap;
    return matches.reduce((varMap: VarMap, match: string) => {
      const key = match.substr(1, match.length - 2);
      varMap[key] = match;
      return varMap;
    }, {} as VarMap);
  }

  preResolve(path: string): string {
    const varMap = this.getVarMap(path);
    return Object.entries(varMap).reduce(
      (path: string, [key, match]: [string, string]) => {
        const MATCH = new RegExp(match, 'g');
        path = path.replace(MATCH, this.vars[key]);
        if (Object.keys(this.getVarMap(path)).length) {
          return this.preResolve(path);
        }
        return path;
      },
      path
    );
  }

  resolve(configPath: string): string {
    const resolvedPath = path.resolve(
      this.rootPath,
      this.preResolve(configPath)
    );
    if (this.rootPath === resolvedPath) return this.rootPath;
    return resolvedPath.substr(this.rootPath.length + 1);
  }
}
