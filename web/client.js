import 'babel-polyfill';
import App from '~/App';
import ignoreWarnings from 'ignore-warnings';
import { AppRegistry } from 'react-native';

ignoreWarnings([
  'Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17'
]);

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  // eslint-disable-next-line no-undef
  rootTag: document.getElementById('app')
});

if (module.hot) module.hot.accept();
