import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { config, log } from 'reaction-base';
import Routes from '~/routes';

@autobind
export default class App extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired
  };

  render() {
    const { context } = this.props;
    log.info('config', config);
    return (
      <Provider store={context.store}>
        <PersistGate loading={null} persistor={context.persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    );
  }
}
