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
            presets: ['react-app', ...(context.config?.babel?.presets || [])],
            babelrc: false
          }
        },
        // {
        //   loader: require.resolve('awesome-typescript-loader')
        // },
        {
          loader: require.resolve('react-docgen-typescript-loader')
        }
      ]
    });
    config.resolve?.extensions?.push('.jsx', '.ts', '.tsx');
    if (!config.node) config.node = {};
    config.node.fs = 'empty';
  }
  return config;
};
