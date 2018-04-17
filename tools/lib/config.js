const { env } = process;

export default {
  host: env.REACTION_HOST || 'localhost',
  port: env.REACTION_PORT || 8888,
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
    presets: ['react', 'react-native', 'stage-2'],
    plugins: ['react-native-web']
  },
  eslint: {},
  webpack: (config, webpack) => {
    return webpack;
  }
};
