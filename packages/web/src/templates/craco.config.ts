import path from 'path';
import { CracoConfig } from '@craco/craco';
import { Paths } from '@reactant/platform';
import { getContext } from '@reactant/context';
import { WebpackConfig } from '../types';

function overrideCracoConfig({
  cracoConfig
}: {
  cracoConfig: CracoConfig;
}): CracoConfig {
  const context = getContext();
  cracoConfig.webpack.configure = (
    webpackConfig: WebpackConfig,
    { paths }: { paths: Paths }
  ): WebpackConfig => {
    let webPath = path.resolve(context.paths.root, config.platformName);
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
    webpackConfig = merge<WebpackConfig>(webpackConfig, context.config.webpack);
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
