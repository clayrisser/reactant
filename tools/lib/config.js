import { getEnv } from 'cross-environment';

const { env } = process;
const environment = getEnv();

export default {
  host: env.REACTION_HOST || 'localhost',
  port: env.REACTION_PORT || 8888,
  envs: {
    NODE_ENV: environment,
    __DEV__: environment !== 'production'
  },
  environment,
  paths: {
    dist: 'dist',
    src: 'src',
    client: 'src/core/client.js',
    server: 'src/core/index.js',
    distPublic: 'dist/public',
    srcPublic: 'src/public'
  }
};
