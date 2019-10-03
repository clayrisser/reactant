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
    const srcPath = 'web';
    paths.appIndexJs = path.resolve(config.rootPath, srcPath, 'index.tsx');
    paths.appSrc = path.resolve(config.rootPath, srcPath);
    paths.testsSetup = path.resolve(config.rootPath, srcPath, 'setupTests.js');
    paths.appTypeDeclarations = path.resolve(
      config.rootPath,
      srcPath,
      'react-app-env.d.ts'
    );
    paths.proxySetup = path.resolve(config.rootPath, srcPath, 'setupProxy.js');
    webpackConfig.entry = [path.resolve(config.rootPath, srcPath, 'index.tsx')];
    findJSRules(webpackConfig.module ? webpackConfig.module.rules : []).forEach(
      (rule: RuleSetRule) => {
        rule.include = path.resolve(config.rootPath, srcPath);
      }
    );
    if (webpackConfig.resolve) {
      (webpackConfig.resolve.plugins || []).forEach((plugin: ResolvePlugin) => {
        const moduleScopePlugin = (plugin as unknown) as ModuleScopePlugin;
        if (
          moduleScopePlugin.appSrcs &&
          moduleScopePlugin.appSrcs.includes(
            path.resolve(config.rootPath, 'src')
          )
        ) {
          moduleScopePlugin.appSrcs = [path.resolve(config.rootPath, srcPath)];
        }
      });
    }
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
