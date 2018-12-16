import 'babel-polyfill';
import CircularJSON from 'circular-json';
import _ from 'lodash';
import fs from 'fs-extra';
import log, { setLevel } from '@reactant/core/log';
import path from 'path';
import pkgDir from 'pkg-dir';
import { createWebpackConfig } from '@reactant/cli/webpack';
import { rebuildConfig } from '@reactant/cli/config';

const mergeConfiguration = require(require.resolve('merge-configuration', {
  paths: [
    path.resolve(
      pkgDir.sync(process.cwd()),
      'node_modules/@reactant/web-isomorphic'
    )
  ]
})).default;
let debug = false;
if (_.includes(process.argv, '--verbose')) setLevel('verbose');
if (_.includes(process.argv, '--debug')) {
  setLevel('debug');
  debug = true;
}

module.exports = webpackConfig => {
  const { config, platform } = rebuildConfig({
    options: { platform: 'web', debug }
  });
  const { paths, babel, options } = config;
  webpackConfig = createWebpackConfig(config, { platform, webpackConfig });
  webpackConfig.resolve.extensions.unshift('.web.js');
  webpackConfig.externals = {
    ...webpackConfig.externals,
    child_process: {},
    deasync: {},
    fs: {},
    winston: {}
  };
  webpackConfig = replaceBabelRule(webpackConfig, {
    test: /\.(js|jsx|mjs)$/,
    include: [
      paths.src,
      paths.stories,
      ...getModuleIncludes(['react-navigation', 'static-container'], config)
    ],
    loader: require.resolve('babel-loader'),
    options: babel
  });
  webpackConfig = mergeConfiguration(
    webpackConfig,
    config.storybook,
    {},
    config
  );
  if (options.debug) {
    fs.mkdirsSync(paths.debug);
    fs.writeFileSync(
      path.resolve(paths.debug, 'webpack.storybook.json'),
      CircularJSON.stringify(webpackConfig, null, 2)
    );
  }
  log.debug('webpackConfig', webpackConfig);
  return webpackConfig;
};

function getModuleIncludes(modules, config) {
  const { paths } = config;
  const includes = [];
  modules.forEach(module => {
    try {
      const modulePath = pkgDir.sync(
        require.resolve(path.resolve(paths.root, 'node_modules', module))
      );
      includes.push(modulePath);
    } catch (err) {}
  });
  return includes;
}

function replaceBabelRule(webpackConfig, rule) {
  const babelRule = _.find(webpackConfig.module.rules, rule => {
    return !!_.find(
      _.isArray(rule.use) ? rule.use : [],
      rule => rule.loader.indexOf('babel-loader') > -1
    );
  });
  _.each(_.keys(babelRule), key => {
    delete babelRule[key];
  });
  _.assign(babelRule, rule);
  return webpackConfig;
}
