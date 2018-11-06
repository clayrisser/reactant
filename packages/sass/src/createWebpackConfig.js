import _ from 'lodash';
import autoprefixer from 'autoprefixer';
import path from 'path';
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

export default function createWebpackConfig(webpackConfig, config) {
  const { paths, env } = config;
  return {
    ...webpackConfig,
    module: {
      ...(webpackConfig.rules || {}),
      rules: [
        ..._.get(webpackConfig, 'module.rules', []),
        {
          // local styles
          test: /\.(s?css|sass)$/,
          exclude: [
            path.resolve(paths.root, 'node_modules'),
            path.resolve(paths.platform, 'styles')
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
            path.resolve(paths.platform, 'styles')
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
        }
      ]
    }
  };
}
