import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { config } from 'reaction-base';

export default class Splash extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { history } = this.props;
    setTimeout(() => {
      history.push('/todo-list');
    }, 500);
  }

  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          minHeight: 48
        }}
      >
        <Text style={{ fontSize: 36 }}>{config.title}</Text>
      </View>
    );
  }
}
