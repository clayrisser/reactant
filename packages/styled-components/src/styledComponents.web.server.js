import React, { Component } from 'react';
import {
  ThemeProvider,
  ServerStyleSheet,
  StyleSheetManager
} from 'styled-components';
import { config } from '@reactant/core';

export default class StyledComponents {
  name = 'styled-components';

  initialized = false;

  constructor(ChildRoot, { theme = {}, themes = {} }) {
    this.ChildRoot = ChildRoot;
    this.theme = {
      ...themes[config.themeName],
      ...theme,
      ...config.theme
    };
  }

  willInit() {
    this.initialized = true;
  }

  willRender(app, { req }) {
    const sheet = new ServerStyleSheet();
    req.sheet = sheet;
    return app;
  }

  getRoot(app, { req }) {
    const { ChildRoot, theme, initialized } = this;
    if (!initialized) return ChildRoot;
    const { sheet } = req;
    return class Root extends Component {
      render() {
        return (
          <StyleSheetManager sheet={sheet.instance}>
            <ThemeProvider theme={theme}>
              <ChildRoot {...req.props} />
            </ThemeProvider>
          </StyleSheetManager>
        );
      }
    };
  }

  didRender(app, { req }) {
    const { $, sheet } = req;
    const css = sheet.getStyleTags();
    $('head').append(`<style type="text/css">${css}</style>`);
    return app;
  }
}
