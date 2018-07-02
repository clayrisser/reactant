import React, { Component } from 'react';
import { StaticRouter } from 'react-router';
import App from '../src/App';

export default class ServerApp extends Component {
  render() {
    return (
      <StaticRouter {...this.props}>
        <App />
      </StaticRouter>
    );
  }
}
