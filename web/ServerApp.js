import React, { Component } from 'react';
import Reaction from 'reaction-base/Reaction';
import { StaticRouter } from 'react-router';

export default class ServerApp extends Component {
  render() {
    return (
      <StaticRouter {...this.props}>
        <Reaction {...this.props} />
      </StaticRouter>
    );
  }
}
