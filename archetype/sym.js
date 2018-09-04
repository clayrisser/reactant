const path = require('path');
const fs = require('fs-extra');
const pkg = require('./package.json');
const _ = require('lodash');

const dependencies = _.concat(
  _.keys(pkg.devDependencies),
  _.keys(pkg.dependencies)
);
const symlinkedDependanies = _.filter(dependencies, dependency => {
  const dependencyPath = path.join(process.cwd(), 'node_modules', dependency);
  const stats = fs.lstatSync(dependencyPath);
  return stats.isSymbolicLink();
});

console.log('symlinkedDependanies', symlinkedDependanies);
