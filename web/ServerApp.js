import React, { Component } from 'react';
import Reaction from 'reaction-base/Reaction';
import { StyleProvider } from 'native-base';
import { StaticRouter } from 'react-router';
import getTheme from '../src/theme/components';
import { material } from '../src/theme/variables';

export default class ServerApp extends Component {
  render() {
    return (
      <StaticRouter {...this.props}>
        <StyleProvider style={getTheme(material)}>
          <Reaction {...this.props} />
        </StyleProvider>
      </StaticRouter>
    );
  }
}
