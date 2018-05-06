import _ from 'lodash';
import createConfig from '../createConfig';
import log, { setLevel } from '../log';

if (_.includes(process.argv, '--verbose')) {
  setLevel('verbose');
}
if (_.includes(process.argv, '--debug')) {
  setLevel('debug');
}

const config = createConfig({});

module.exports = webpackConfig => {
  webpackConfig.resolve.extensions.unshift('.web.js');
  webpackConfig.resolve.alias = { '~': config.paths.src };
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
  log.debug('webpackConfig', webpackConfig);
  return webpackConfig;
};
