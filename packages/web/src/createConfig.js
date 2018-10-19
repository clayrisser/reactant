import _ from 'lodash';

const storybook =
  _.includes(process.argv, '-s') || _.includes(process.argv, '--storybook');

export default function(config) {
  return {
    ...config,
    babel: {
      ...config.babel,
      presets: [...config.babel.presets, require.resolve('babel-preset-react')],
      plugins: [
        require.resolve('react-hot-loader/babel'),
        ...config.babel.plugins
      ]
    },
    ports: {
      ...config.ports,
      storybook: null
    },
    webpack: webpack => webpack,
    ...(storybook ? { storybook: webpack => webpack } : {})
  };
}
