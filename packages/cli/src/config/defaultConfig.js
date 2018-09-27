const { env } = process;

export default {
  title: 'Reactant',
  moduleName: 'reactant',
  host: env.REACTANT_HOST || 'localhost',
  port: env.REACTANT_PORT || 6001,
  envs: {},
  level: 'info',
  ignore: {
    errors: [],
    warnings: [
      'Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17',
      'Webpack Bundle Analyzer saved report to',
      'node_modules/bindings',
      'node_modules/colors',
      'node_modules/deasync',
      'node_modules/ejs/lib/ejs',
      'node_modules/express'
    ]
  },
  initialState: {},
  whitelist: [],
  blacklist: [],
  offline: false,
  paths: {
    android: 'android',
    client: 'web/client.js',
    debug: 'reactant/debug',
    dist: 'dist',
    distAndroid: 'dist/android',
    distExpo: 'dist/expo',
    distIos: 'dist/ios',
    distStorybook: 'dist/storybook',
    distWeb: 'dist/web',
    distWebPublic: 'distWeb/public',
    expo: 'expo',
    ios: 'ios',
    reactant: '.reactant',
    root: '',
    server: 'node_modules/@reactant/cli/lib/server.js',
    src: 'src',
    srcPublic: 'src/public',
    stories: 'stories',
    storybook: 'reactant/storybook',
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
    presets: [
      [
        'env',
        {
          targets: {
            node: '6'
          }
        }
      ],
      'react-native',
      'stage-0'
    ],
    plugins: ['transform-decorators-legacy', 'lodash', 'react-native-web']
  },
  eslint: {
    extends: ['jam']
  },
  platform: {
    android: {},
    ios: {},
    expo: {},
    web: {
      native: true,
      isomorphic: true
    }
  },
  webpack: (config, webpack) => webpack,
  storybook: (config, webpack) => webpack
};
