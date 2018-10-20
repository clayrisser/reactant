import React, { Component } from 'react';
import { Reactant } from '@reactant/web';

export default class ClientRoot extends Component {
  render() {
    return <Reactant {...this.props} />;
  }
}
