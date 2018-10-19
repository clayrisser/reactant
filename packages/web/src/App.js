import React from 'react';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp } from '@reactant/core';
import { render } from 'react-dom';
import ClientRoot from '~/../web/ClientRoot';

const { document } = window;

export default class App extends ReactantApp {
  constructor({ props = {}, container = document.getElementById('app') }) {
    super(...arguments);
    this.props = props;
    this.container = container;
    if (!this.config.options.debug) {
      ignoreWarnings(this.config.ignore.warnings || []);
      ignoreWarnings('error', this.config.ignore.errors || []);
    }
  }

  render() {
    super.render();
    render(<ClientRoot {...this.props} />, this.container);
  }
}
