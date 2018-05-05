import 'babel-polyfill';
import App from '~/App';
import ignoreWarnings from 'ignore-warnings';
import { AppRegistry } from 'react-native';
import log from 'reaction/log';
import React from 'react';
import ReactDOM from 'react-dom';

ignoreWarnings([
  'Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17'
]);

AppRegistry.registerComponent('App', () => App);
renderApp();

if (module.hot) {
  module.hot.accept('~/App', () => {
    AppRegistry.registerComponent('App', () => require('~/App').default);
    renderApp();
  });
}

function renderApp() {
  AppRegistry.runApplication('App', {
    initialProps: {},
    // eslint-disable-next-line no-undef
    rootTag: document.getElementById('app')
  });
}
