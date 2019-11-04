import path from 'path';
import util from 'util';
import { CracoConfig } from '@craco/craco';
import { Paths } from '@reactant/platform';
import { getContext, merge } from '@reactant/context';
import {
  Configuration as WebpackConfig,
  ResolvePlugin,
  RuleSetRule
} from 'webpack';

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

function overrideCracoConfig({
  cracoConfig
}: {
  cracoConfig: CracoConfig;
}): CracoConfig {
  const context = getContext();
  if (!cracoConfig.webpack) cracoConfig.webpack = {};
  cracoConfig.webpack.configure = (
    webpackConfig: WebpackConfig,
    { paths }: { paths: Paths }
  ): WebpackConfig => {
    let webPath = path.resolve(context.paths.root, context.platformName);
    let srcPath = path.resolve(context.paths.root, 'src');
    if (context.action === 'build') {
      webPath = path.resolve(
        context.paths.root,
        context.paths.build,
        context.platformName
      );
      srcPath = path.resolve(context.paths.root, context.paths.build, 'src');
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
      '~': srcPath
    };
    if (context.debug) {
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
    webpackConfig = merge<WebpackConfig>(
      webpackConfig,
      // eslint-disable-next-line no-undef
      context.config?.webpack || {}
    );
    return webpackConfig;
  };
  return cracoConfig;
}

module.exports = {
  plugins: [
    {
      plugin: {
        overrideCracoConfig
      }
    }
  ]
} as CracoConfig;
