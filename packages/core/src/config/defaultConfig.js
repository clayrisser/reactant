import resolve from '@reactant/core/resolve';

const { env } = process;

export default {
  envs: {},
  host: env.REACTANT_HOST || '0.0.0.0',
  level: 'info',
  platforms: {},
  plugins: [],
  port: env.REACTANT_PORT || 6001,
  webpack: {},
  eslint: {
    extends: ['jam']
  },
  ports: {
    dev: null
  },
  ignore: {
    errors: [],
    warnings: []
  },
  paths: {
    debug: '{reactant}/debug',
    dist: 'dist/{_platform}',
    platform: '{_platform}',
    reactant: '.reactant/{_platform}',
    root: '',
    src: 'src'
  },
  babel: {
    babelrc: false,
    presets: [
      [
        resolve('@babel/preset-env', __dirname),
        {
          targets: {
            node: '6'
          }
        }
      ],
      resolve('@babel/preset-react', __dirname),
      resolve('babel-preset-everything', __dirname)
    ]
  }
};
