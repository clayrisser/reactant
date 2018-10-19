import App from '~/App';
import React, { Component } from 'react';
// eslint-disable-next-line import/no-unresolved
import { hot } from '@reactant/web/node_modules/react-hot-loader';

class Reactant extends Component {
  render() {
    return <App {...this.props} />;
  }
}

export default hot(module)(Reactant);
