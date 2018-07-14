import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import style from './style';

export default function CenterView(props) {
  const { children } = props;
  return (
    <View style={style.main}>
      {children}
    </View>
);
}

CenterView.defaultProps = {
  children: null
};

CenterView.propTypes = {
  children: PropTypes.node
};
