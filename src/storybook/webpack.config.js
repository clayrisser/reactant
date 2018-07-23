import 'babel-polyfill';
import CircularJSON from 'circular-json';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import _ from 'lodash';
import log, { setLevel } from 'reaction-base/log';
import { sleep } from 'deasync';
import createConfig from '../createConfig';

if (_.includes(process.argv, '--verbose')) setLevel('verbose');
if (_.includes(process.argv, '--debug')) setLevel('debug');

module.exports = webpackConfig => {
  let config = null;
  createConfig({}).then(loadedConfig => {
    config = loadedConfig;
  });
  while (!config) sleep(100);
  webpackConfig.resolve.extensions.unshift('.web.js');
  webpackConfig.resolve.alias = {
    '~': config.paths.src,
    'native-base': require.resolve('native-base-web'),
    'react/lib/ReactNativePropRegistry': require.resolve(
      'react-native-web/dist/modules/ReactNativePropRegistry'
    ),
    'react-native': require.resolve('react-native-web')
  };
  webpackConfig.externals = {
    ...webpackConfig.externals,
    'reaction-base/config': CircularJSON.stringify(config),
    child_process: {},
    deasync: {},
    fs: {},
    winston: {}
  };
  webpackConfig.plugins = [
    ...webpackConfig.plugins,
    new OpenBrowserPlugin({ url: `http://localhost:${config.ports.storybook}` })
  ];
  const jsxRule = _.find(
    webpackConfig.module.rules,
    rule => rule.loader.indexOf('babel-loader') > -1
  );
  _.assign(jsxRule, {
    query: {
      ...jsxRule.query,
      ...config.babel,
      plugins: [...jsxRule.query.plugins, ...(config.babel.plugins || [])],
      presets: [...jsxRule.query.presets, ...(config.babel.presets || [])]
    }
  });
  webpackConfig = config.storybook(config, webpackConfig);
  log.debug('webpackConfig', webpackConfig);
  return webpackConfig;
};
