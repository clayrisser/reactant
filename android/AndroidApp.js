import React, { Component } from 'react';
import { NativeRouter } from 'react-router-native';
import { StyleProvider, Root } from 'native-base';
import getTheme from '../src/theme/components';
import variables from '../src/theme/variables';
import App from '../src/App';

export default class AndroidApp extends Component {
  render() {
    return (
      <NativeRouter {...this.props}>
        <StyleProvider style={getTheme(variables)}>
          <Root>
            <App />
          </Root>
        </StyleProvider>
      </NativeRouter>
    );
  }
}
