import React, { Component } from 'react';
import {
  ThemeProvider,
  ServerStyleSheet,
  StyleSheetManager
} from 'styled-components';
import { config } from '@reactant/core';

export default class StyledComponents {
  name = 'styled-components';

  constructor(ChildRoot, { theme = {}, themes = {} }) {
    this.ChildRoot = ChildRoot;
    this.theme = {
      ...themes[config.styledComponents.themeName],
      ...theme,
      ...config.styledComponents.theme
    };
  }

  willRender(app, { req }) {
    const sheet = new ServerStyleSheet();
    req.sheet = sheet;
    return app;
  }

  getRoot(app, { req }) {
    const { ChildRoot, theme } = this;
    const { sheet, props } = req;
    return class StyledComponentsPlugin extends Component {
      render() {
        return (
          <StyleSheetManager sheet={sheet.instance}>
            <ThemeProvider theme={theme}>
              <ChildRoot {...props} />
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
