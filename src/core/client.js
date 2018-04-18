import 'babel-polyfill';
import React from 'react';
import { hydrate } from 'react-dom';
import App from '../App';

hydrate(
  <App />,
  // eslint-disable-next-line no-undef
  document.getElementById('app')
);
