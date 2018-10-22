import React, { Component } from 'react';
import Reactant from '@reactant/web-isomorphic/Reactant';

export default class ServerRoot extends Component {
  render() {
    return <Reactant {...this.props} />;
  }
}
