import React from 'react';
import SassProvider from './SassProvider';

export default class StyledComponents {
  name = '@reactant/sass';

  constructor(ChildRoot) {
    this.ChildRoot = ChildRoot;
  }

  willRender(app) {
    app.sass = {};
    app.props.context = {
      ...req.props.context,
      insertCss: (...styles) => {
        const removeCss = styles.map(style => style._insertCss());
        return () => removeCss.forEach(f => f());
      }
    };
    return app;
  }

  getRoot(app) {
    const { ChildRoot } = this;
    const { props } = app;
    return (
      <SassProvider>
        <ChildRoot {...props} />
      </SassProvider>
    );
  }
}
