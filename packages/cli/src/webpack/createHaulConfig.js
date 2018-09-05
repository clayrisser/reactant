import _ from 'lodash';

export default function createHaulConfig(config, webpackConfig) {
  const { paths } = config;
  webpackConfig = replaceBabelRule(webpackConfig, {
    test: /\.(js|jsx|mjs)$/,
    include: [paths.root],
    loader: require.resolve('babel-loader')
  });
  webpackConfig = {
    ...webpackConfig,
    module: {
      ...webpackConfig.module,
      rules: [...(webpackConfig.module ? webpackConfig.module.rules : []), {}]
    }
  };
  return webpackConfig;
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
