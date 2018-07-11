import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { config } from 'reaction-base';
import Routes from '~/routes';

@autobind
export default class App extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired
  };

  render() {
    console.log('config', config);
    return (
      <Provider store={this.props.context.store}>
        <PersistGate loading={null} persistor={this.props.context.persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    );
  }
}
