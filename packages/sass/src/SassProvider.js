import PropTypes from 'prop-types';
import { Component } from 'react';
import _ from 'lodash';
import styles from '~/styles';

export default class SassProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  static contextTypes = {
    insertCss: PropTypes.func.isRequired
  };

  styles = {};

  componentWillMount() {
    const { insertCss } = this.context;
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
    return this.props.children;
  }
}
