import React, { Component } from 'react';
import Reactant from '@reactant/base/Reactant';
import { BrowserRouter } from 'react-router-dom';
import { StyleProvider } from 'native-base';
import getTheme from '../src/theme/components';
import { material } from '../src/theme/variables';

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
