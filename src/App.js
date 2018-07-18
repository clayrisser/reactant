import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import Routes from '~/routes';

@autobind
export default class App extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired
  };

  render() {
    const { context } = this.props;
    return (
      <Provider store={context.store}>
        <PersistGate loading={null} persistor={context.persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    );
  }
}
