import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'native-base';
import style from './style';

export default class StorybookView extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  render() {
    const { children } = this.props;
    return <View style={style.main}>{children}</View>;
  }
}
