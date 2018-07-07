import 'babel-polyfill';
import Cookies from 'cookies-js';
import React from 'react';
import ReactDOM from 'react-dom';
import ignoreWarnings from 'ignore-warnings';
import { AppRegistry } from 'react-native';
import { log } from 'reaction-base';
import { persistStore } from 'redux-persist';
import createStore from '../src/store/create';
import initialState from '../src/store/initialState';

ignoreWarnings([
  'Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17'
]);

const context = { cookieJar: Cookies };

const renderApp = async () => {
  context.store = await createStore(context);
  context.persistor = await new Promise(resolve => {
    const persistor = persistStore(context.store, initialState, () => {
      return resolve(persistor);
    });
  });
  const ClientApp = require('./ClientApp').default;
  AppRegistry.registerComponent('App', () => ClientApp);
  AppRegistry.runApplication('App', {
    initialProps: {
      context
    },
    // eslint-disable-next-line no-undef
    rootTag: document.getElementById('app')
  });
};

if (module.hot) module.hot.accept('~/App', () => renderApp());
renderApp();
