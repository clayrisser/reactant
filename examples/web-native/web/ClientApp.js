import React, { Component } from 'react';
import { Reactant } from '@reactant/base';
import { BrowserRouter } from 'react-router-dom';

export default class ClientApp extends Component {
  render() {
    return (
      <BrowserRouter {...this.props}>
        <Reactant {...this.props} />
      </BrowserRouter>
    );
  }
}
