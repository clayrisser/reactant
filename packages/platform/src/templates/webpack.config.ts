import { createWebpackProdConfig } from '@craco/craco';
import * as cracoConfig from './craco.config';

console.log('LOADED WEBPACK');

const webpackConfig = createWebpackProdConfig(cracoConfig);

console.log(webpackConfig);

console.log('DONE');

module.exports = webpackConfig;
