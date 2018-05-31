import App from '~/App';
import React, { Component } from 'react';
import { StaticRouter } from 'react-router';

export default class ServerApp extends Component {
  render() {
    return (
      <StaticRouter {...this.props}>
        <App />
      </StaticRouter>
    );
  }
}
