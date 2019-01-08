import mergeConfiguration from 'merge-configuration';
import path from 'path';
import pkgDir from 'pkg-dir';
import { getRules } from '@reactant/cli/lib/webpack';
import {
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin
} from 'webpack';
import createClientConfig from './createClientConfig';
import createServerConfig from './createServerConfig';

const rootPath = pkgDir.sync(process.cwd());

export default function createWebConfig(
  config,
  { webpackConfig, target = 'web', platform }
) {
  const { paths, /* eslint, */ babel, env, action } = config;
  process.env.NODE_ENV = env;
  if (target === 'client') target = 'web';
  if (target === 'server') target = 'node';
  webpackConfig = {
    ...webpackConfig,
    context: process.cwd(),
    target,
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ...(webpackConfig?.resolve?.alias || {}),
        'webpack/hot/poll': require.resolve('webpack/hot/poll')
      }
    },
    module: {
      strictExportPresence: true,
      rules: [
        ...(webpackConfig.rules || []),
        ...getRules(config, { platform }),
        // {
        //   test: /\.(js|jsx|mjs)$/,
        //   include: [paths.android, paths.ios, paths.src, paths.web],
        //   loader: require.resolve('eslint-loader'),
        //   options: eslint,
        //   enforce: 'pre'
        // },
        {
          test: /\.(js|jsx|mjs)$/,
          include: [
            path.resolve(rootPath, paths.src),
            path.resolve(rootPath, paths.platform),
            ...getModuleIncludes([
              '@reactant/core',
              'react-navigation',
              'static-container'
            ])
          ],
          loader: require.resolve('babel-loader'),
          options: babel
        }
      ]
    },
    plugins: [
      ...webpackConfig.plugins,
      ...(env !== 'production' ? [new NamedModulesPlugin()] : []),
      ...(action === 'start'
        ? [new HotModuleReplacementPlugin(), new NoEmitOnErrorsPlugin()]
        : [])
    ]
  };
  if (target === 'web') {
    webpackConfig = createClientConfig(config, { platform, webpackConfig });
  } else {
    webpackConfig = createServerConfig(config, { platform, webpackConfig });
  }
  return mergeConfiguration(webpackConfig, config.webpack, {}, config);
}

function getModuleIncludes(modules) {
  const includes = [];
  modules.forEach(module => {
    try {
      const modulePath = pkgDir.sync(
        require.resolve(path.resolve(rootPath, 'node_modules', module))
      );
      includes.push(modulePath);
    } catch (err) {}
  });
  return includes;
}
