import App from '~/App';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

export default class ClientApp extends Component {
  render() {
    return (
      <BrowserRouter {...this.props}>
        <App />
      </BrowserRouter>
    );
  }
}
