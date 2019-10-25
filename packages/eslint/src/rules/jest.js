module.exports = {
  overrides: [
    {
      files: '*.test.js',
      env: {
        jest: true
      },
      plugins: ['jest']
    }
  ]
};
