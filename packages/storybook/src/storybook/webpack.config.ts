import fs from 'fs-extra';
import getContext from '@reactant/context';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration as WebpackConfig } from 'webpack';

const context = getContext();

module.exports = ({ config }: { config: WebpackConfig }) => {
  process.env = {
    ...process.env,
    ...context.envs,
  };
  if (config) {
    config.module?.rules.push({
      test: /\.(j|t)sx?$/,
      include: [
        path.resolve(context.paths.root, context.platformName),
        path.resolve(context.paths.root, 'src'),
        ...context.includePaths,
      ],
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            ...(context.config?.babel || {}),
            plugins: [
              [
                'transform-inline-environment-variables',
                {
                  include: Object.keys(context.envs),
                },
              ],
              ...(context.config?.babel?.plugins || []),
            ],
            presets: [
              ...new Set([
                'react-app',
                ...(context.config?.babel?.presets || []),
              ]),
            ],
            babelrc: false,
          },
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });
    if (!config.resolve) config.resolve = {};
    config.resolve.extensions?.push('.jsx', '.ts', '.tsx');
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    const configAliasPath = path.resolve(
      context.paths.root,
      'storybook/config.ts'
    );
    if (fs.pathExistsSync(configAliasPath)) {
      config.resolve.alias[
        '@reactant/web/lib/alias/storybook/config'
      ] = configAliasPath;
    }
    if (!config.node) config.node = {};
    config.node = {
      child_process: 'empty',
      fs: 'empty',
      ...config.node,
    };
  }
  return config;
};
