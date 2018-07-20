import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import App from '../../src/App';

export default class Reaction extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired
  };

  render() {
    const { store, persistor, history } = this.props.context;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedRouter history={history}>
            <App {...this.props} />
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    );
  }
}
