import 'babel-polyfill';
import CircularJSON from 'circular-json';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import _ from 'lodash';
import log, { setLevel } from '@reactant/base/log';
import path from 'path';
// eslint-disable-next-line import/no-unresolved
import getRules from '@reactant/cli/lib/webpack/getRules';
// eslint-disable-next-line import/no-unresolved
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
  webpackConfig.plugins = [
    ...webpackConfig.plugins,
    new OpenBrowserPlugin({
      url: `http://localhost:${config.ports.storybook}`
    })
  ];
  webpackConfig = replaceBabelRule(webpackConfig, {
    test: /\.(js|jsx|mjs)$/,
    include: [paths.root],
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
