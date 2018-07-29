import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import App from '../../src/App';

export default class Reaction extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const childContextTypes = {};
    _.each(props.context, (item, key) => {
      childContextTypes[key] = PropTypes[typeof item];
    });
    this.constructor.childContextTypes = childContextTypes;
  }

  getChildContext() {
    return this.props.context;
  }

  componentWillMount() {
    const { context } = this.props;
    if (context.insertCss) {
      const rootStyle = require('../../web/styles/root.scss?root=./web/styles/');
      this.removeCss = context.insertCss(rootStyle);
    }
  }

  componentWillUnmount() {
    if (this.removeCss) this.removeCss();
  }

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
