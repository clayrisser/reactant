import getContext, { merge } from '@reactant/context';
import path from 'path';
import cracoPluginReactHotReload from 'craco-plugin-react-hot-reload';
import util from 'util';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CracoConfig, CracoBabel } from '@craco/craco';
import { Paths } from '@reactant/platform';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Configuration as WebpackConfig,
  ResolvePlugin,
  RuleSetRule
} from 'webpack';

interface ModuleScopePlugin {
  appSrcs: string[];
}

function updatePaths(paths: Paths, webPath: string, buildPath: string | null) {
  if (buildPath) paths.appBuild = buildPath;
  paths.appIndexJs = path.resolve(webPath, 'index.tsx');
  paths.appSrc = webPath;
  paths.appTypeDeclarations = path.resolve(webPath, 'react-app-env.d.ts');
  paths.proxySetup = path.resolve(webPath, 'setupProxy.js');
  paths.testsSetup = path.resolve(webPath, 'setupTests.js');
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

function overrideCracoConfig(args: {
  cracoConfig: CracoConfig;
  context: {
    env: string;
    paths: string[];
  };
}): CracoConfig {
  const { cracoConfig } = args;
  const cracoContext = args.context;
  const context = getContext();
  if (!cracoConfig.webpack) cracoConfig.webpack = {};
  cracoConfig.webpack.configure = (
    webpackConfig: WebpackConfig,
    { paths }: { paths: Paths }
  ): WebpackConfig => {
    const webPath = path.resolve(context.paths.root, context.platformName);
    const srcPath = path.resolve(context.paths.root, 'src');
    let buildPath = null;
    if (context.action === 'build') {
      buildPath = path.resolve(context.paths.root, context.paths.build);
      if (!webpackConfig.output) webpackConfig.output = {};
      webpackConfig.output.path = buildPath;
      if (!webpackConfig.plugins) webpackConfig.plugins = [];
      if (context.options.analyze) {
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
      }
    }
    updatePaths(paths, webPath, buildPath);
    webpackConfig.entry = [path.resolve(webPath, 'index.tsx')];
    findJSRules(webpackConfig.module ? webpackConfig.module.rules : []).forEach(
      (rule: RuleSetRule) => {
        rule.include = [webPath, srcPath, ...context.includePaths];
      }
    );
    if (!webpackConfig.resolve) webpackConfig.resolve = {};
    if (!webpackConfig.resolve.alias) webpackConfig.resolve.alias = {};
    if (cracoContext.env === 'development') {
      webpackConfig.resolve.alias['react-dom'] = path.resolve(
        context.paths.root,
        'node_modules/react-dom'
      );
    }
    (webpackConfig.resolve.plugins || []).forEach((plugin: ResolvePlugin) => {
      const moduleScopePlugin = (plugin as unknown) as ModuleScopePlugin;
      if (
        moduleScopePlugin.appSrcs &&
        moduleScopePlugin.appSrcs.includes(srcPath)
      ) {
        moduleScopePlugin.appSrcs = [webPath, srcPath];
      }
    });
    webpackConfig = merge<WebpackConfig>(
      webpackConfig,
      // eslint-disable-next-line no-undef
      context.config?.webpack || {}
    );
    if (typeof webpackConfig.entry === 'string') {
      webpackConfig.entry = [webpackConfig.entry];
    }
    ((webpackConfig.entry as unknown) as string[]).unshift(
      'react-hot-loader/patch'
    );

    if (context.debug) {
      // eslint-disable-next-line no-console
      console.info(
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
  context.config?.babel.plugins.push([
    'transform-inline-environment-variables',
    {
      include: Object.keys(context.envs)
    }
  ]);
  cracoConfig.babel = merge<CracoBabel>(
    cracoConfig.babel || {},
    // eslint-disable-next-line no-undef
    context.config?.babel
  );
  process.env = {
    ...process.env,
    ...context.envs
  };
  return cracoConfig;
}

module.exports = {
  plugins: [
    { plugin: cracoPluginReactHotReload },
    {
      plugin: {
        overrideCracoConfig
      }
    }
  ]
} as CracoConfig;
