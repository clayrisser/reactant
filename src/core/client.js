import React from 'react';
import { AppRegistry } from 'react-native';
import App from '../App';

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  // eslint-disable-next-line no-undef
  rootTag: document.getElementById('root')
});

if (module.hot) {
  module.hot.accept();
}
