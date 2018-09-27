import 'babel-polyfill';
import CircularJSON from 'circular-json';
import _ from 'lodash';
import getRules from '@reactant/cli/lib/webpack/getRules';
import log, { setLevel } from '@reactant/base/log';
import path from 'path';
import pkgDir from 'pkg-dir';
import { loadConfig } from '@reactant/cli/lib/config';

if (_.includes(process.argv, '--verbose')) setLevel('verbose');
if (_.includes(process.argv, '--debug')) setLevel('debug');

module.exports = webpackConfig => {
  const config = loadConfig({});
  const { paths } = config;
  webpackConfig.resolve.extensions.unshift('.web.js');
  webpackConfig.resolve.symlinks = false;
  webpackConfig.resolve.alias = {
    '~': paths.src,
    'react-native': require.resolve('react-native-web'),
    '@reactant/storybook': '~/../.reactant/storybook',
    'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': require.resolve(
      'react-native-web/dist/modules/ReactNativePropRegistry'
    )
  };
  webpackConfig.externals = {
    ...webpackConfig.externals,
    'react-art': {},
    '@reactant/base/config': CircularJSON.stringify(config),
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
      ...getModuleIncludes(
        [
          'native-base',
          'native-base-shoutem-theme',
          'react-native-drawer',
          'react-native-easy-grid',
          'react-native-keyboard-aware-scroll-view',
          'react-native-safe-area-view',
          'react-native-tab-view',
          'react-native-vector-icons',
          'react-native-web',
          'react-navigation',
          'static-container'
        ],
        config
      )
    ],
    loader: require.resolve('babel-loader')
  });
  webpackConfig.module.rules = [
    ...webpackConfig.module.rules,
    ...getRules(config)
  ];
  if (_.isFunction(config.storybook)) {
    webpackConfig = config.storybook(config, webpackConfig);
  } else {
    webpackConfig = _.merge(webpackConfig, config.storybook);
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
