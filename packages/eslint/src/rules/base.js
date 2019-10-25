module.exports = {
  rules: {
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    'default-case': 'off',
    'import/no-cycle': 'off',
    'no-await-in-loop': 'off',
    'no-extra-boolean-cast': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    yoda: 'off',
    'no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        vars: 'all'
      }
    ],
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^~', '^./lib']
      }
    ],
    'comma-dangle': ['error', 'never']
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
};
