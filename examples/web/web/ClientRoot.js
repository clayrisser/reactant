import React, { Component } from 'react';
import { Root } from '@reactant/web';

export default class ClientRoot extends Component {
  render() {
    return <Root {...this.props} />;
  }
}
