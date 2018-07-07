import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import Routes from '~/routes';
import createStore from '~/store/create';
import autobind from 'autobind-decorator';

@autobind
export default class App extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired
  };

  render() {
    return (
      <Provider store={this.props.context.store}>
        <PersistGate loading={null} persistor={this.props.context.persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    );
  }
}
