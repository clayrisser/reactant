import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';

export default class ClientApp extends Component {
  render() {
    return (
      <BrowserRouter {...this.props}>
        <App {...this.props} />
      </BrowserRouter>
    );
  }
}
