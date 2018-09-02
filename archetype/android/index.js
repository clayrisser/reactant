import 'babel-polyfill';
import initAndroid from '@reactant/base/init/android';
import config from './config.json';

const initialProps = {};

export default initAndroid(initialProps, config);
