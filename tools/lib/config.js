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
  }
};
