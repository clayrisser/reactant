import React, { Component } from 'react';
import { config } from '@reactant/core';
import SassProvider from './SassProvider';

export default class StyledComponents {
  name = '@reactant/sass';

  constructor(ChildRoot) {
    this.ChildRoot = ChildRoot;
  }

  willRender(app, { req }) {
    req.sass = { css: new Set() };
    req.props.context = {
      ...req.props.context,
      insertCss: (...styles) => {
        return styles.forEach(style => req.sass.css.add(style._getCss()));
      }
    };
    return app;
  }

  didRender(app, { req }) {
    const { $, props, sass } = req;
    $('head').append(
      `<style type="text/css">${[...sass.css].join('')}</style>`
    );
    return app;
  }

  getRoot(app, { req }) {
    const { ChildRoot } = this;
    const { props } = req;
    return (
      <SassProvider>
        <ChildRoot {...props} />
      </SassProvider>
    );
  }
}
