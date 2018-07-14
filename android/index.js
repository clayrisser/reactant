import 'babel-polyfill';
import initAndroid from 'reaction-base/init/android';
import config from './config.json';

const initialProps = {};

export default initAndroid(initialProps, config);
