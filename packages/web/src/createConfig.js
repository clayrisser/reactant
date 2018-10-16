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
    webpack: webpack => webpack,
    storybook: webpack => webpack
  };
}
