const { env } = process;

export default {
  host: env.REACTION_HOST || 'localhost',
  port: env.REACTION_PORT || 3333,
  envs: {},
  paths: {
    dist: 'dist',
    src: 'src',
    client: 'src/core/client.js',
    server: 'src/core/index.js',
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
  eslint: {},
  webpack: (config, webpack) => {
    return webpack;
  }
};
