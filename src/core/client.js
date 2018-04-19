import 'babel-polyfill';
import App from '~/App';
import hotModule from '~/core/hotModule';
import { AppRegistry } from 'react-native';

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  // eslint-disable-next-line no-undef
  rootTag: document.getElementById('app')
});

hotModule();
