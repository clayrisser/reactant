const { env } = process;

export default {
  title: 'Reaction',
  host: env.REACTION_HOST || 'localhost',
  port: env.REACTION_PORT || 3333,
  envs: {},
  paths: {
    client: 'web/client.js',
    dist: 'dist',
    distPublic: 'dist/public',
    server: 'web/index.js',
    src: 'src',
    srcPublic: 'src/public',
    web: 'web'
  },
  publish: {
    android: 'echo',
    ios: 'echo',
    web: 'echo'
  },
  babel: {
    presets: [['env', { modules: false }], 'react', 'stage-2'],
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
