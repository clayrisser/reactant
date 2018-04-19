import 'babel-polyfill';
import App from '~/App';
import { AppRegistry } from 'react-native';

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  // eslint-disable-next-line no-undef
  rootTag: document.getElementById('app')
});

if (module.hot) {
  module.hot.accept();
}
