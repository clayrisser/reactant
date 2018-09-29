import _ from 'lodash';
import path from 'path';

function loadReactantPlatform(config, platformName) {
  const { paths } = config;
  const rootPath = path.resolve(paths.root, 'node_modules', platformName);
  const packagePkg = require(path.resolve(rootPath, 'package.json'));
  let platform = require(path.resolve(rootPath, packagePkg.reactantPlatform));
  if (platform.__esModule) platform = platform.default;
  platform = {
    ...platform,
    actions: _.zipObject(
      _.keys(platform.actions),
      _.map(platform.actions, action => {
        if (action.run) {
          if (action.dependsOn) return action;
          return { ...action, dependsOn: [] };
        }
        return { run: action, dependsOn: [] };
      })
    ),
    rootPath
  };
  return platform;
}

function getReactantPlatforms(config) {
  const { paths } = config;
  const platformNames = _.keys(
    require(path.resolve(paths.root, 'package.json')).dependencies
  );
  return _.filter(platformNames, platformName => {
    return !!require(path.resolve(
      paths.root,
      'node_modules',
      platformName,
      'package.json'
    )).reactantPlatform;
  });
}

export { loadReactantPlatform, getReactantPlatforms };
export default { loadReactantPlatform, getReactantPlatforms };
