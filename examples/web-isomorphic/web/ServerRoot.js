import React, { Component } from 'react';
import { Reactant } from '@reactant/web-isomorphic';

export default class ServerRoot extends Component {
  render() {
    return <Reactant {...this.props} />;
  }
}
