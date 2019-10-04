import path from 'path';
import util from 'util';
import { Config, WebpackConfig, Paths, JestConfig } from '@reactant/platform';
import { RuleSetRule, ResolvePlugin } from 'webpack';

interface ModuleScopePlugin {
  appSrcs: string[];
}

function updatePaths(paths: Paths, webPath: string) {
  paths.appIndexJs = path.resolve(webPath, 'index.tsx');
  paths.appSrc = webPath;
  paths.testsSetup = path.resolve(webPath, 'setupTests.js');
  paths.appTypeDeclarations = path.resolve(webPath, 'react-app-env.d.ts');
  paths.proxySetup = path.resolve(webPath, 'setupProxy.js');
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
  if (!config.jest) config.jest = {};
  config.jest.configure = (
    jestConfig: JestConfig,
    { paths }: { paths: Paths }
  ) => {
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
    updatePaths(paths, webPath);
    jestConfig.roots = [webPath, srcPath];
    jestConfig.collectCoverageFrom = [
      ...jestConfig.collectCoverageFrom,
      `${config.platformName}/**/*.{js,jsx,ts,tsx}`,
      `!${config.platformName}/**/*.d.ts`
    ];
    jestConfig.testMatch = [
      ...jestConfig.testMatch,
      '<rootDir>/src/**/tests/**/*.{js,jsx,ts,tsx}',
      `<rootDir>/${config.platformName}/**/*.{spec,test}.{js,jsx,ts,tsx}`,
      `<rootDir>/${config.platformName}/**/__tests__/**/*.{js,jsx,ts,tsx}`,
      `<rootDir>/${config.platformName}/**/tests/**/*.{js,jsx,ts,tsx}`
    ];
    if (config.debug) {
      console.log('paths', paths);
      console.log(
        '\n\n======== START JEST ========\n',
        util.inspect(jestConfig, {
          colors: true,
          showHidden: true,
          depth: null
        }),
        '\n========= END JEST =========\n\n'
      );
    }
    return jestConfig;
  };
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
    updatePaths(paths, webPath);
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
        util.inspect(webpackConfig, {
          colors: true,
          showHidden: true,
          depth: null
        }),
        '\n========= END WEBPACK =========\n\n'
      );
    }
    return webpackConfig;
  };
  return config;
}
