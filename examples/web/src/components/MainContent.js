import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class MainContent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  render() {
    return <div style={this.props.style}>{this.props.children}</div>;
  }
}
