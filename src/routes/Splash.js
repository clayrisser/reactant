import React, { Component } from 'react';
import { Text } from 'react-native';
import { Link } from 'reaction';

export default class Splash extends Component {
  render() {
    return (
      <Link to="/404">
        <Text>Splash</Text>
      </Link>
    );
  }
}
