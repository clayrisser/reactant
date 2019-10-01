import { createWebpackProdConfig } from '@craco/craco';
import * as cracoConfig from './craco.config';

const webpackConfig = createWebpackProdConfig(cracoConfig);

module.exports = webpackConfig;
