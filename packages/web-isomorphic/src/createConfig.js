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
    ignore: {
      ...config.ignore,
      warnings: [
        ..._.get(config, 'ignore.warnings', []),
        'bindings/bindings.js 76:22-40',
        'bindings/bindings.js 76:43-53',
        'colors.js 138:29-43',
        'deasync/index.js 31:12-28',
        'ejs/lib/ejs.js 903:4-22',
        'ejs/lib/ejs.js 904:2-20',
        'parse5/lib/index.js 55:23-49',
        'view.js 81:13-25'
      ]
    },
    ports: {
      ...config.ports,
      storybook: null
    },
    paths: {
      ...config.paths,
      stories: 'stories',
      storybook: '{reactant}/storybook'
    },
    webpack: webpack => webpack,
    ...(storybook ? { storybook: webpack => webpack } : {})
  };
}
