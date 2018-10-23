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
    this.sheet = new ServerStyleSheet();
    this.theme = {
      ...themes[config.themeName],
      ...theme,
      ...config.theme
    };
  }

  get Root() {
    const { ChildRoot, sheet, theme } = this;
    return class Root extends Component {
      render() {
        return (
          <StyleSheetManager sheet={sheet.instance}>
            <ThemeProvider theme={theme}>
              <ChildRoot {...this.props} />
            </ThemeProvider>
          </StyleSheetManager>
        );
      }
    };
  }

  modifyCheerio($) {
    return $;
  }
}
