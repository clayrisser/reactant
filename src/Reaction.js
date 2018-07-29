import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import App from '../../src/App';

function ReactionWrapper(props) {
  class Reaction extends Component {
    static propTypes = {
      context: PropTypes.object.isRequired
    };

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
