const { env } = process;

export default {
  title: 'Reaction',
  host: env.REACTION_HOST || 'localhost',
  port: env.REACTION_PORT || 3333,
  envs: {},
  paths: {
    dist: 'dist',
    src: 'src',
    client: 'web/client.js',
    server: 'web/index.js',
    distPublic: 'dist/public',
    srcPublic: 'src/public'
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
