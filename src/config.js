const { env } = process;

export default {
  title: 'Reaction',
  host: env.REACTION_HOST || 'localhost',
  port: env.REACTION_PORT || 3333,
  envs: {},
  paths: {
    android: 'android',
    client: 'web/client.js',
    dist: 'dist',
    distPublic: 'dist/public',
    distStorybook: 'dist/storybook',
    ios: 'ios',
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
    presets: [['env', { modules: false }], 'react-native', 'stage-2'],
    plugins: [
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
  webpack: (config, webpack) => {
    return webpack;
  }
};
