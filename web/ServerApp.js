import React, { Component } from 'react';
import { StaticRouter } from 'react-router';
import { StyleProvider, Root } from 'native-base';
import App from '../src/App';
import getTheme from '../src/theme/components';
import variables from '../src/theme/variables';

export default class ServerApp extends Component {
  render() {
    return (
      <StaticRouter {...this.props}>
        <StyleProvider style={getTheme(variables)}>
          <Root>
            <App />
          </Root>
        </StyleProvider>
      </StaticRouter>
    );
  }
}
