import React, { Component, FC } from 'react';
// eslint-disable-next-line import/no-unresolved
import Provider, { ProviderProps } from './Provider';

export interface UnknownProps {
  [key: string]: any;
}

export default function withProvider(
  App: FC | typeof Component,
  providerProps?: ProviderProps
): FC {
  return (props: UnknownProps) => (
    <Provider
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...providerProps}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <App {...props} />
    </Provider>
  );
}
