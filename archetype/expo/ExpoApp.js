import React, { Component } from 'react';
import Reactant from '@reactant/base/lib/Reactant';
import { Font } from 'expo';
import { NativeRouter } from 'react-router-native';
import { Root, StyleProvider } from 'native-base';
import fonts from '../src/assets/fonts';
import getTheme from '../src/theme/components';
import { material } from '../src/theme/variables';

export default class ExpoApp extends Component {
  componentDidMount() {
    Font.loadAsync(fonts);
  }

  render() {
    return (
      <NativeRouter {...this.props}>
        <StyleProvider style={getTheme(material)}>
          <Root>
            <Reactant {...this.props} />
          </Root>
        </StyleProvider>
      </NativeRouter>
    );
  }
}
