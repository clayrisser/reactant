import React, { Component } from 'react';
import { Reactant } from '@reactant/web-isomorphic';

export default class ClientRoot extends Component {
  render() {
    return <Reactant {...this.props} />;
  }
}
