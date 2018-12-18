import _ from 'lodash';
import autoprefixer from 'autoprefixer';
import path from 'path';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import resolve from '@reactant/core/resolve';

const postcssLoader = {
  loader: resolve('postcss-loader', __dirname),
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
            resolve('isomorphic-style-loader', __dirname),
            {
              loader: resolve('css-loader', __dirname),
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
            resolve('sass-loader', __dirname)
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
            resolve('isomorphic-style-loader', __dirname),
            {
              loader: resolve('css-loader', __dirname),
              options: {
                importLoaders: 1,
                localIdentName: '[local]',
                minimize: env !== 'development',
                sourceMap: env === 'development'
              }
            },
            postcssLoader,
            resolve('sass-loader', __dirname)
          ]
        }
      ]
    }
  };
}
