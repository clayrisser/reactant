import TrailDuck from 'trailduck';
import _ from 'lodash';
import path from 'path';
import pkgDir from 'pkg-dir';

export default class ConfigPaths {
  paths = null;

  constructor(config) {
    const { paths, platformName } = config;
    this.config = config;
    this.pathVars = { ...paths, _platform: platformName };
    this.parsedPathVars = this.getParsedPathVars();
    this.rootPath = pkgDir.sync(process.cwd());
    this.hasCycles({ throwError: true });
    this.paths = this.getPaths();
  }

  getPaths() {
    return _.reduce(
      this.config.paths,
      (paths, configPath, key) => {
        if (!_.includes(_.keys(paths), key)) {
          paths[key] = this.resolve(configPath, key);
        }
        return paths;
      },
      {}
    );
  }

  getParsedPathVars() {
    const parsedPathVars = _.reduce(
      this.pathVars,
      (parsedPathVars, pathVar, key) => {
        parsedPathVars[key] = this.parsePathVar(pathVar);
        return parsedPathVars;
      },
      {}
    );
    return parsedPathVars;
  }

  parsePathVar(pathVar) {
    const regex = /{(([^{/])|(\\\/)|(\\{))+}/g;
    const matches = pathVar.match(regex);
    return _.reduce(
      matches,
      (parsedPathVar, match) => {
        const key = match.substr(1, match.length - 2);
        parsedPathVar[key] = match;
        return parsedPathVar;
      },
      {}
    );
  }

  hasCycles({ throwError = false }) {
    const graph = {};
    _.each(this.parsedPathVars, (parsedPathVar, key) => {
      graph[key] = { children: _.keys(parsedPathVar) };
    });
    const trailDuck = new TrailDuck(graph);
    const cyclicalPathVarNames = _.uniq(_.flatten(trailDuck.cycles));
    if (cyclicalPathVarNames.length) {
      if (throwError) {
        throw new Error(
          `cyclical path variables detected '${cyclicalPathVarNames.join(
            "', '"
          )}'`
        );
      }
      return cyclicalPathVarNames;
    }
    return false;
  }

  preResolve(configPath, key) {
    const parsedPathVar = this.parsedPathVars[key];
    const resolvedPath = _.reduce(
      parsedPathVar,
      (configPath, match, key) => {
        const MATCH = new RegExp(match, 'g');
        configPath = configPath.replace(MATCH, this.pathVars[key]);
        const parsedPathVar = this.parsePathVar(configPath);
        if (_.keys(parsedPathVar).length) {
          return this.preResolve(configPath, key);
        }
        return configPath;
      },
      configPath
    );
    return resolvedPath;
  }

  resolve(configPath, key) {
    const resolvedPath = path.resolve(
      this.rootPath,
      this.preResolve(configPath, key)
    );
    return resolvedPath.substr(this.rootPath.length + 1);
  }
}
