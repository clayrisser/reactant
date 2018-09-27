import React, { Component } from 'react';
import Reactant from '@reactant/base/lib/Reactant';
import { StaticRouter } from 'react-router-dom';
import { StyleProvider } from 'native-base';
import getTheme from '../src/theme/components';
import { material } from '../src/theme/variables';

export default class ServerApp extends Component {
  render() {
    return (
      <StaticRouter {...this.props}>
        <StyleProvider style={getTheme(material)}>
          <Reactant {...this.props} />
        </StyleProvider>
      </StaticRouter>
    );
  }
}
