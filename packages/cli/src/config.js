const { env } = process;

export default {
  title: 'Reaction',
  host: env.REACTION_HOST || 'localhost',
  port: env.REACTION_PORT || 6001,
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
    dist: 'dist',
    distAndroid: 'dist/android',
    distExpo: 'dist/expo',
    distIos: 'dist/ios',
    distStorybook: 'dist/storybook',
    distWeb: 'dist/web',
    distWebPublic: 'distWeb/public',
    expo: 'expo',
    ios: 'ios',
    root: '',
    server: 'node_modules/reaction-build/lib/server.js',
    src: 'src',
    srcPublic: 'src/public',
    stories: 'storybook/stories',
    storybook: 'storybook',
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
        '@babel/preset-env',
        {
          targets: {
            node: '6'
          }
        }
      ],
      'react-native',
      'everything'
    ],
    plugins: ['lodash', 'react-native-web']
  },
  eslint: {
    extends: ['airbnb', 'prettier'],
    parser: 'babel-eslint',
    rules: {
      'comma-dangle': ['error', 'never']
    }
  },
  webpack: (config, webpack) => webpack,
  storybook: (config, webpack) => webpack
};
