import context from '@reactant/context';
import { configure } from '@storybook/react';

const { paths } = context;

configure(
  require.context('../../../../../src', true, /\.stories\.(j|t)sx?$/),
  module
);
