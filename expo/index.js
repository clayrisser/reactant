import 'babel-polyfill';
import registerExpo from 'reaction-base/register/expo';
import config from './config.json';

const initialProps = {};

registerExpo(initialProps, config);
