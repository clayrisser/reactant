import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import style from './style';

export default class CenterView extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  componentWillMount() {
    // eslint-disable-next-line global-require
    const rootStyle = require('../../../web/styles/root.scss?root=./web/styles/');
    this.removeCss = insertCss(rootStyle);
  }

  componentWillUnmount() {
    if (this.removeCss) this.removeCss();
  }

  render() {
    const { children } = this.props;
    return <View style={style.main}>{children}</View>;
  }
}

function insertCss(...styles) {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(f => f());
}
