import Popup from '~/components/Popup';
import React, { Component } from 'react';
import Routes from '~/Routes';
import { StyleSheet, Text, View } from 'react-native';

class App extends Component {
  render() {
    return (
      <View style={styles.box}>
        <Text style={styles.text}>Hello, world!</Text>
        <Popup title="Popup" message="I am a popup" />
        <Routes />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: { padding: 10 },
  text: { fontWeight: 'bold' }
});

export default App;
