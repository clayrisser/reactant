import { createWebpackDevConfig } from '@craco/craco';
import * as cracoConfig from './craco.config';

const webpackConfig = createWebpackDevConfig(cracoConfig);

module.exports = webpackConfig;
