import path from 'path';
import { RuleSetRule, ResolvePlugin } from 'webpack';
import { Config, WebpackConfig, Paths } from '@reactant/platform';

interface ModuleScopePlugin {
  appSrcs: string[];
}

function findJSRules(rules: RuleSetRule[]): RuleSetRule[] {
  return rules.reduce((rules: RuleSetRule[], rule: RuleSetRule) => {
    if (rule.test && rule.test.toString().indexOf('js|mjs|jsx|ts|tsx')) {
      rules.push(rule);
    } else if (rule.oneOf) {
      rules = [...rules, ...findJSRules(rule.oneOf)];
    }
    return rules;
  }, []);
}

export default function createConfig(config: Config): Config {
  if (!config.webpack) config.webpack = {};
  config.webpack.configure = (
    webpackConfig: WebpackConfig,
    { paths }: { paths: Paths }
  ): WebpackConfig => {
    let webPath = path.resolve(config.rootPath, config.platformName);
    let srcPath = path.resolve(config.rootPath, 'src');
    if (config.action === 'build') {
      webPath = path.resolve(
        config.rootPath,
        config.paths.build,
        config.platformName
      );
      srcPath = path.resolve(config.rootPath, config.paths.build, 'src');
    }
    paths.appIndexJs = path.resolve(webPath, 'index.tsx');
    paths.appSrc = webPath;
    paths.testsSetup = path.resolve(webPath, 'setupTests.js');
    paths.appTypeDeclarations = path.resolve(webPath, 'react-app-env.d.ts');
    paths.proxySetup = path.resolve(webPath, 'setupProxy.js');
    webpackConfig.entry = [path.resolve(webPath, 'index.tsx')];
    findJSRules(webpackConfig.module ? webpackConfig.module.rules : []).forEach(
      (rule: RuleSetRule) => {
        rule.include = [webPath, srcPath];
      }
    );
    if (!webpackConfig.resolve) webpackConfig.resolve = {};
    (webpackConfig.resolve.plugins || []).forEach((plugin: ResolvePlugin) => {
      const moduleScopePlugin = (plugin as unknown) as ModuleScopePlugin;
      if (
        moduleScopePlugin.appSrcs &&
        moduleScopePlugin.appSrcs.includes(srcPath)
      ) {
        moduleScopePlugin.appSrcs = [webPath, srcPath];
      }
    });
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@reactant/src': srcPath
    };
    if (config.debug) {
      console.log(
        '\n\n======== START WEBPACK ========\n',
        webpackConfig,
        '\n========= END WEBPACK =========\n\n'
      );
    }
    return webpackConfig;
  };
  return config;
}
