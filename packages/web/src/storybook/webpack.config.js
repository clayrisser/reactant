import 'babel-polyfill';
import _ from 'lodash';
import mergeConfiguration from 'merge-configuration';
import { createWebpackConfig } from '@reactant/cli/webpack';
import log, { setLevel } from '@reactant/core/log';
import path from 'path';
import pkgDir from 'pkg-dir';
import { loadConfig } from '@reactant/cli/config';

if (_.includes(process.argv, '--verbose')) setLevel('verbose');
if (_.includes(process.argv, '--debug')) setLevel('debug');

module.exports = webpackConfig => {
  const config = loadConfig({});
  const { paths } = config;
  webpackConfig = createWebpackConfig(config, webpackConfig);
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
    loader: require.resolve('babel-loader')
  });
  webpackConfig = mergeConfiguration(
    webpackConfig,
    config.storybook,
    {},
    config
  );
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
