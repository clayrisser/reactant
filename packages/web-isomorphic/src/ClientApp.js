import React from 'react';
import autobind from 'autobind-decorator';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp, config, log } from '@reactant/core';
import { callLifecycle } from '@reactant/core/plugin';
import { hydrate } from 'react-dom';
import Reactant from './Reactant';

@autobind
export default class ClientApp extends ReactantApp {
  constructor(Root = Reactant, options = {}) {
    const { container = document.getElementById('app') } = options;
    super(...arguments);
    this.Root = Root;
    this.container = container;
    if (!config.options.debug) {
      ignoreWarnings(config.ignore.warnings || []);
      ignoreWarnings('error', config.ignore.errors || []);
    }
  }

  async render() {
    await callLifecycle('willRender', this, {});
    this.props.context = {
      insertCss: (...styles) => {
        const removeCss = styles.map(style => style._insertCss());
        return () => removeCss.forEach(f => f());
      }
    };
    this.Root = await this.getRoot({});
    const { Root } = this;
    hydrate(<Root {...this.props} />, document.getElementById('app'));
    await callLifecycle('didRender', this, {});
  }

  async init() {
    await super.init();
    if (config.offline) require('offline-plugin/runtime').install();
    if (module.hot) {
      module.hot.accept('~/../web/ClientRoot', this.render);
    }
    await this.render().catch(log.error);
    return this;
  }
}
