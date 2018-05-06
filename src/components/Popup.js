import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Alert, Platform } from 'react-native';

@autobind
export default class Popup extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  };

  render() {
    return <Button onPress={this.handlePress} title={this.props.title} />;
  }

  handlePress() {
    if (Platform.OS === 'web') {
      alert(this.props.message);
    } else {
      Alert.alert(this.props.message);
    }
  }
}
