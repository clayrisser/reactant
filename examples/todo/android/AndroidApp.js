import React, { Component } from 'react';
import { NativeRouter } from 'react-router-native';
import { Reactant } from '@reactant/base';
import { Root, StyleProvider } from 'native-base';
import getTheme from '~/theme/components';
import { material } from '~/theme/variables';

export default class AndroidApp extends Component {
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
