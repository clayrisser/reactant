import React from 'react';
import autobind from 'autobind-decorator';
import ignoreWarnings from 'ignore-warnings';
import { ReactantApp, config, log } from '@reactant/core';
import { callLifecycle } from '@reactant/core/plugin';
import { hydrate } from 'react-dom';
import Reactant from './Reactant';

@autobind
export default class ClientApp extends ReactantApp {
  constructor(BaseRoot = Reactant, options = {}) {
    const { container = document.getElementById('app') } = options;
    super(...arguments);
    this.BaseRoot = BaseRoot;
    this.container = container;
    if (!config.options.debug) {
      ignoreWarnings(config.ignore.warnings || []);
      ignoreWarnings('error', config.ignore.errors || []);
    }
  }

  async render() {
    await callLifecycle('willRender', this, {});
    const { props } = this;
    props.context = {
      ...props.context,
      insertCss: (...styles) => {
        const removeCss = styles.map(style => style._insertCss());
        return () => removeCss.forEach(f => f());
      }
    };
    const Root = await this.getRoot({});
    if (window.reactant) window.reactant.context = props.context;
    hydrate(<Root {...props} />, document.getElementById('app'));
    await callLifecycle('didRender', this, {});
  }

  async init() {
    log.debug('local rendering taking over');
    await super.init();
    if (config.offline) require('offline-plugin/runtime').install();
    if (module.hot) {
      module.hot.accept('@reactant/web-isomorphic/ClientRoot', this.render);
    }
    await this.render().catch(log.error);
    return this;
  }
}
