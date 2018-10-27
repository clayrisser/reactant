import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
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

  getRoot(app) {
    const { ChildRoot, theme } = this;
    const { props } = app;
    return class StyledComponentsPlugin extends Component {
      render() {
        return (
          <ThemeProvider theme={theme}>
            <ChildRoot {...props} />
          </ThemeProvider>
        );
      }
    };
  }
}
