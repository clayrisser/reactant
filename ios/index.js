import 'babel-polyfill';
import registerIos from 'reaction-base/register/ios';
import config from './config.json';

const initialProps = {};

registerIos(initialProps, config);
