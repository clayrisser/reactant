import App from '~/App';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class Reactant extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired
  };

  constructor(props) {
    super();
    const childContextTypes = _.reduce(
      props.context,
      (context, value, key) => {
        let type = typeof value;
        if (_.isArray(value)) type = 'array';
        if (type === 'function') type = 'func';
        context[key] = PropTypes[type].isRequired;
        return context;
      },
      {}
    );
    const ReactantContext = class ReactantContext extends Component {
      static childContextTypes = childContextTypes;

      getChildContext() {
        return _.reduce(
          childContextTypes,
          (context, value, key) => {
            context[key] = props.context[key];
            return context;
          },
          {}
        );
      }

      render() {
        return <App {...this.props} />;
      }
    };
    this.ReactantContext = ReactantContext;
  }

  render() {
    const { ReactantContext } = this;
    return <ReactantContext {...this.props} />;
  }
}

export default hot(module)(Reactant);
