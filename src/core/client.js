import 'babel-polyfill';
import { AppRegistry } from 'react-native';
import App from '../App';

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  // eslint-disable-next-line no-undef
  rootTag: document.getElementById('app')
});

if (module.hot) {
  module.hot.accept();
}
