import React, { Component } from 'react';
import config from '../config';

export default class Html extends Component {
  render() {
    return (
      <html lang="en">
        <head>
          <title>{config.title}</title>
        </head>
        <body>
          <div
            id="app" // eslint-disable-line react/no-danger
            dangerouslySetInnerHTML={{ __html: this.props.children }}
          />
        </body>
      </html>
    );
  }
};
