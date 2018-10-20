import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <button type="button" {...this.props}>
        {this.props.children}
      </button>
    );
  }
}
