import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Reactant } from '@reactant/base';
import { StyleProvider } from 'native-base';
import getTheme from '~/theme/components';
import { material } from '~/theme/variables';

export default class ClientApp extends Component {
  render() {
    return (
      <BrowserRouter {...this.props}>
        <StyleProvider style={getTheme(material)}>
          <Reactant {...this.props} />
        </StyleProvider>
      </BrowserRouter>
    );
  }
}
