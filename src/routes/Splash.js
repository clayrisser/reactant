import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'native-base';

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
      <View>
        <Text>Loading . . .</Text>
      </View>
    );
  }
}
