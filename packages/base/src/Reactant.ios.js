import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { config } from 'reactant-base';

if (typeof global.self === 'undefined') global.self = global;

function ReactantWrapper(props) {
  class Reactant extends Component {
    static propTypes = {
      context: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);
      this.App = require('../../src/App').default;
      if (config.options.storybook) {
        this.App = require('../../node_modules/@reactant/cli/lib/storybook/native').default;
      }
    }

    getChildContext() {
      return this.props.context;
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
  const childContextTypes = {};
  _.each(props.context, (item, key) => {
    if (_.isArray(item)) {
      return (childContextTypes[key] = PropTypes.array.isRequired);
    }
    if (_.isFunction(item)) {
      return (childContextTypes[key] = PropTypes.func.isRequired);
    }
    return (childContextTypes[key] = PropTypes[typeof item].isRequired);
  });
  Reactant.childContextTypes = childContextTypes;
  return <Reactant {...props} />;
}

ReactantWrapper.propTypes = {
  context: PropTypes.object.isRequired
};

export default ReactantWrapper;
