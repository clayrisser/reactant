import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';

const root = document.getElementById('root');

ReactDOM.render(<App />, root);

serviceWorker.unregister();

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(<NextApp />, root);
  });
}
