import resolve from '@reactant/core/resolve';

const { env } = process;

export default {
  title: 'Reactant',
  moduleName: 'reactant',
  host: env.REACTANT_HOST || '0.0.0.0',
  port: env.REACTANT_PORT || 6001,
  ports: {
    dev: null
  },
  plugins: [],
  envs: {},
  level: 'info',
  ignore: {
    errors: [],
    warnings: []
  },
  offline: false,
  paths: {
    debug: '{reactant}/debug',
    dist: 'dist/{_platform}',
    platform: '{_platform}',
    reactant: '.reactant/{_platform}',
    root: '',
    src: 'src'
  },
  publish: {},
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
  },
  eslint: {
    extends: ['jam']
  },
  platforms: {},
  webpack: {}
};
