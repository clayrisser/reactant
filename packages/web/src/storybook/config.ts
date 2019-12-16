import context from '@reactant/context';
import path from 'path';
import { configure } from '@storybook/react';

const { paths } = context;

configure(
  require.context(
    path.resolve(paths.root, '../../src'),
    true,
    /\.stories\.(j|t)sx?$/
  ),
  module
);
