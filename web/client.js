import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ignoreWarnings from 'ignore-warnings';
import { AppRegistry } from 'react-native';
import { log } from 'reaction';

ignoreWarnings([
  'Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17'
]);

if (module.hot) module.hot.accept('~/App', () => renderApp());
renderApp();

function renderApp() {
  AppRegistry.registerComponent('App', () => require('~/App').default);
  AppRegistry.runApplication('App', {
    initialProps: {},
    // eslint-disable-next-line no-undef
    rootTag: document.getElementById('app')
  });
}
