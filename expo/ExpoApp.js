import React, { Component } from 'react';
import Reaction from 'reaction-base/Reaction';
import { NativeRouter } from 'react-router-native';
import { Root, StyleProvider } from 'native-base';
import getTheme from '../src/theme/components';
import { material } from '../src/theme/variables';

export default class ExpoApp extends Component {
  render() {
    return (
      <NativeRouter {...this.props}>
        <StyleProvider style={getTheme(material)}>
          <Root>
            <Reaction {...this.props} />
          </Root>
        </StyleProvider>
      </NativeRouter>
    );
  }
}
