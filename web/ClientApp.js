import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StyleProvider, Root } from 'native-base';
import App from '../src/App';
import getTheme from '../src/theme/components';
import variables from '../src/theme/variables';

export default class ClientApp extends Component {
  render() {
    return (
      <BrowserRouter {...this.props}>
        <StyleProvider style={getTheme(variables)}>
          <Root>
            <App />
          </Root>
        </StyleProvider>
      </BrowserRouter>
    );
  }
}
