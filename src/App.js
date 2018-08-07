import Ionicons from 'react-native-vector-icons/Fonts/Ionicons.ttf';
import React, { Component } from 'react';
import { Font } from 'expo';
import Routes from '~/routes';

export default class App extends Component {
  componentDidMount() {
    Font.loadAsync({
      Ionicons
    });
  }

  render() {
    return <Routes />;
  }
}
