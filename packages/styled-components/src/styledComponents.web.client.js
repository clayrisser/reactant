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

  get Root() {
    const { ChildRoot, theme } = this;
    return class Root extends Component {
      render() {
        return (
          <ThemeProvider theme={theme}>
            <ChildRoot {...this.props} />
          </ThemeProvider>
        );
      }
    };
  }
}
