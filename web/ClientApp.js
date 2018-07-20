import React, { Component } from 'react';
import Reaction from 'reaction-base/Reaction';
import { BrowserRouter } from 'react-router-dom';

export default class ClientApp extends Component {
  render() {
    return (
      <BrowserRouter {...this.props}>
        <Reaction {...this.props} />
      </BrowserRouter>
    );
  }
}
