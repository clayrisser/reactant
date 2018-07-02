import React, { Component } from 'react';
import { NativeRouter } from 'react-router-native';
import { StyleProvider, Root } from 'native-base';
import App from '../src/App';
import getTheme from '../src/theme/components';
import { material } from '../src/theme/variables';

export default class ExpoApp extends Component {
  render() {
    return (
      <NativeRouter {...this.props}>
        <StyleProvider style={getTheme(material)}>
          <Root>
            <App />
          </Root>
        </StyleProvider>
      </NativeRouter>
    );
  }
}
