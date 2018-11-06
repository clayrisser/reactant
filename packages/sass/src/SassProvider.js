import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import styles from '~/styles';

export default class SassProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    insertCss: PropTypes.func.isRequired
  };

  styles = {};

  componentWillMount() {
    const { insertCss } = this.props;
    _.each(styles, (style, key) => {
      this.styles[key] = { remove: insertCss(style) };
    });
  }

  componentWillUnmount() {
    _.each(styles, (style, key) => {
      this.styles[key].remove();
    });
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
