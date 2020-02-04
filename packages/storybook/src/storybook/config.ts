// eslint-disable-next-line import/no-unresolved,import/extensions
import '@reactant/web/lib/alias/storybook/config';
import { configure } from '@storybook/react';

configure(
  // @ts-ignore
  require.context('../../../../../src', true, /\.stories\.(j|t)sx?$/),
  module
);
