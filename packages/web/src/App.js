import React from 'react';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp, config } from '@reactant/core';
import { render } from 'react-dom';
import Reactant from './Reactant';

const { document } = window;

export default class App extends ReactantApp {
  constructor(Root = Reactant, options = {}) {
    super(...arguments);
    const { container = document.getElementById('app') } = options;
    this.Root = Root;
    this.container = container;
    if (!config.options.debug) {
      ignoreWarnings(config.ignore.warnings || []);
      ignoreWarnings('error', config.ignore.errors || []);
    }
  }

  async init() {
    await super.init();
    const { Root } = this;
    render(<Root {...this.props} />, this.container);
    return this;
  }
}
