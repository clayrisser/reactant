import 'babel-polyfill';
import registerAndroid from 'reaction-base/register/android';
import config from './config.json';

const initialProps = {};

registerAndroid(initialProps, config);
