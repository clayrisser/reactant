import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { config } from 'reaction-base';

function ReactionWrapper(props) {
  class Reaction extends Component {
    static propTypes = {
      context: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);
      this.App = require('../../src/App').default;
      if (config.options.storybook) {
        this.App = require('../../storybook').default;
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
  Reaction.childContextTypes = childContextTypes;
  return <Reaction {...props} />;
}

ReactionWrapper.propTypes = {
  context: PropTypes.object.isRequired
};

export default ReactionWrapper;
