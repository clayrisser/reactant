import React, { Component } from 'react';
import { Reactant } from '@reactant/web';

export default class ClientApp extends Component {
  render() {
    return <Reactant {...this.props} />;
  }
}
