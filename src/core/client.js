import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import config from '../config';

const context = { config };

ReactDOM.render((
  <App context={context} />
));
