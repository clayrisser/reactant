import CircularJSON from 'circular-json';
import { Configuration as WebpackConfig } from 'webpack';
import { getContext } from '@reactant/context';

const context = getContext();

module.exports = ({ config }: { config: WebpackConfig }) => {
  if (config) {
    config.module?.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            ...(context.config?.babel || {}),
            presets: [
              ...new Set([
                'react-app',
                ...(context.config?.babel?.presets || [])
              ])
            ],
            babelrc: false
          }
        },
        {
          loader: require.resolve('react-docgen-typescript-loader')
        }
      ]
    });
    if (!config.resolve) config.resolve = {};
    config.resolve.extensions?.push('.jsx', '.ts', '.tsx');
    if (!config.node) config.node = {};
    config.node = {
      child_process: 'empty',
      fs: 'empty',
      ...config.node
    };
    if (!config.externals) config.externals = {};
    if (typeof config.externals === 'object') {
      config.externals = {
        '@reactant/context': CircularJSON.stringify(context),
        ...config.externals
      };
    }
  }
  return config;
};
