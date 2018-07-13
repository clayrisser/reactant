import Cookies from 'cookies-js';
import ignoreWarnings from 'ignore-warnings';
import { AppRegistry } from 'react-native';
import { persistStore } from 'redux-persist';
import initialState from '../../../src/store/initialState';
import { config } from '..';
import { createWebStore } from '../createStore';
import { setLevel } from '../log';

const { document } = window;

async function renderClient(initialProps) {
  const context = {
    cookieJar: Cookies
  };
  context.store = await createWebStore(context);
  context.persistor = await new Promise(resolve => {
    const persistor = persistStore(context.store, initialState, () => {
      return resolve(persistor);
    });
  });
  initialProps.context = context;
  const ClientApp = require('../../../web/ClientApp').default;
  AppRegistry.registerComponent('App', () => ClientApp);
  AppRegistry.runApplication('App', {
    initialProps,
    rootTag: document.getElementById('app')
  });
}

export default function client(initialProps = {}) {
  ignoreWarnings([
    'Calling ReactDOM.render() to hydrate server-rendered ' +
      'markup will stop working in React v17'
  ]);
  if (config.options.verbose) {
    setLevel('verbose');
  } else if (config.options.debug || config.env === 'development') {
    setLevel('debug');
  }
  if (module.hot)
    module.hot.accept(
      '../../../web/ClientApp',
      renderClient.bind(this, initialProps)
    );
  renderClient(initialProps).catch(console.error);
  return { config, initialProps };
}
