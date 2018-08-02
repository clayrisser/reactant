import path from 'path';
import autoprefixer from 'autoprefixer';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    ident: 'postcss',
    plugins: () => [
      postcssFlexbugsFixes,
      autoprefixer({
        browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
        flexbox: 'no-2009'
      })
    ]
  }
};

export default function getRules({ paths, env }) {
  return [
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      include: [
        paths.src,
        paths.web,
        path.resolve('node_modules/reaction-base')
      ],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'media/[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.html?$/,
      include: [
        paths.src,
        paths.web,
        path.resolve('node_modules/reaction-base')
      ],
      loader: require.resolve('html-loader')
    },
    {
      test: /\.md$/,
      include: [
        paths.src,
        paths.web,
        path.resolve('node_modules/reaction-base')
      ],
      use: [
        {
          loader: require.resolve('html-loader')
        },
        {
          loader: require.resolve('markdown-loader'),
          options: {
            pedantic: true,
            gfm: true,
            breaks: true
          }
        }
      ]
    },
    {
      // local styles
      test: /\.(s?css|sass)$/,
      exclude: [
        path.resolve(paths.root, 'node_modules'),
        path.resolve(paths.web, 'styles')
      ],
      loaders: [
        'isomorphic-style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            localIdentName:
              env === 'development'
                ? '[name]_[local]_[hash:base64:3]'
                : '[hash:base64:4]',
            minimize: env !== 'development',
            sourceMap: env === 'development'
          }
        },
        postcssLoader,
        'sass-loader'
      ]
    },
    {
      // global styles
      test: /\.(s?css|sass)$/,
      include: [
        path.resolve(paths.root, 'node_modules'),
        path.resolve(paths.web, 'styles')
      ],
      loaders: [
        'isomorphic-style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            localIdentName: '[local]',
            minimize: env !== 'development',
            sourceMap: env === 'development'
          }
        },
        postcssLoader,
        'sass-loader'
      ]
    },
    {
      exclude: [
        /\.(js|jsx|mjs)$/,
        /\.(less)$/,
        /\.(re)$/,
        /\.(s?css|sass)$/,
        /\.(ts|tsx)$/,
        /\.(vue)$/,
        /\.bmp$/,
        /\.gif$/,
        /\.html?$/,
        /\.jpe?g$/,
        /\.json$/,
        /\.md$/,
        /\.png$/
      ],
      loader: require.resolve('file-loader'),
      options: {
        name: 'media/[name].[hash:8].[ext]'
      }
    }
  ];
}
