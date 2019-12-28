import { configure } from '@storybook/react';

configure(
  // @ts-ignore
  require.context('../../../../../src', true, /\.stories\.(j|t)sx?$/),
  module
);
