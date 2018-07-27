import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { config } from 'reaction-base';

export default class Reaction extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.App = require('../../src/App').default;
    if (config.action === 'storybook') {
      this.App = require('../../storybook').default;
    }
  }

  render() {
    const { App } = this;
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
