import 'babel-polyfill';
import CircularJSON from 'circular-json';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import _ from 'lodash';
import log, { setLevel } from '@reactant/base/log';
import path from 'path';
import { sleep } from 'deasync';
import createConfig from '../../createConfig';
import getRules from '../../webpack/getRules';

if (_.includes(process.argv, '--verbose')) setLevel('verbose');
if (_.includes(process.argv, '--debug')) setLevel('debug');

module.exports = webpackConfig => {
  let config = null;
  createConfig({}).then(loadedConfig => {
    config = loadedConfig;
  });
  while (!config) sleep(100);
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
  const jsxRule = _.find(
    webpackConfig.module.rules,
    rule => rule.loader.indexOf('babel-loader') > -1
  );
  _.assign(jsxRule, {
    include: [
      ...jsxRule.include,
      paths.src,
      paths.web,
      path.resolve('node_modules/native-base-shoutem-theme'),
      path.resolve('node_modules/react-native-drawer'),
      path.resolve('node_modules/react-native-easy-grid'),
      path.resolve('node_modules/react-native-keyboard-aware-scroll-view'),
      path.resolve('node_modules/react-native-safe-area-view'),
      path.resolve('node_modules/react-native-tab-view'),
      path.resolve('node_modules/react-native-vector-icons'),
      path.resolve('node_modules/react-native-web'),
      path.resolve('node_modules/@reactant/base'),
      path.resolve('node_modules/static-container')
    ],
    query: {
      ...jsxRule.query,
      ...config.babel,
      plugins: [...jsxRule.query.plugins, ...(config.babel.plugins || [])],
      presets: [...jsxRule.query.presets, ...(config.babel.presets || [])]
    }
  });
  delete jsxRule.exclude;
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
