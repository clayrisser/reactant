import React from 'react';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp, config } from '@reactant/core';
import { callLifecycle } from '@reactant/core/plugin';
import { render } from 'react-dom';
import Reactant from './Reactant';

const { document } = window;

export default class App extends ReactantApp {
  constructor(BaseRoot = Reactant, options = {}) {
    super(...arguments);
    const { container = document.getElementById('app') } = options;
    this.BaseRoot = BaseRoot;
    this.container = container;
    if (!config.options.debug) {
      ignoreWarnings(config.ignore.warnings || []);
      ignoreWarnings('error', config.ignore.errors || []);
    }
  }

  async init() {
    await super.init();
    await callLifecycle('willRender', this, {});
    const { props } = this;
    const Root = await this.getRoot({});
    if (window.reactant) window.reactant.context = props.context;
    render(<Root {...props} />, this.container);
    await callLifecycle('didRender', this, {});
    return this;
  }
}
