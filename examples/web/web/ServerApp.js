import React, { Component } from 'react';
import { Reactant } from '@reactant/base';
import { StaticRouter } from 'react-router-dom';

export default class ServerApp extends Component {
  render() {
    return (
      <StaticRouter {...this.props}>
        <Reactant {...this.props} />
      </StaticRouter>
    );
  }
}
