const { env } = process;

export default {
  title: 'Reaction',
  host: env.REACTION_HOST || 'localhost',
  port: env.REACTION_PORT || 6001,
  envs: {},
  ignore: {
    errors: [],
    warnings: [
      'Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17'
    ]
  },
  initialState: {},
  whitelist: [],
  blacklist: [],
  paths: {
    android: 'android',
    client: 'web/client.js',
    dist: 'dist',
    distPublic: 'dist/public',
    distStorybook: 'dist/storybook',
    expo: 'expo',
    ios: 'ios',
    root: '',
    server: 'node_modules/reaction-build/lib/server.js',
    src: 'src',
    srcPublic: 'src/public',
    stories: 'storybook/stories',
    web: 'web'
  },
  publish: {
    android: 'echo "missing publish script"',
    expo: 'echo "missing publish script"',
    ios: 'echo "missing publish script"',
    storybook: 'echo "missing publish script"',
    web: 'echo "missing publish script"'
  },
  babel: {
    presets: ['env', 'react-native', 'stage-2'],
    plugins: [
      'lodash',
      'transform-decorators-legacy',
      'transform-class-properties',
      'react-native-web'
    ]
  },
  eslint: {
    extends: ['airbnb', 'prettier'],
    parser: 'babel-eslint',
    rules: {
      'comma-dangle': ['error', 'never']
    }
  },
  webpack: (config, webpack) => webpack,
  storybook: (config, webpack) => webpack
};
