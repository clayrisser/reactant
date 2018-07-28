import autoprefixer from 'autoprefixer';

module.exports = {
  plugins: [autoprefixer({ browsers: ['last 3 versions', '> 1%'] })]
};
