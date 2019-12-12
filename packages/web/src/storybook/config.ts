import path from 'path';
import { configure } from '@storybook/react';
import { getContext } from '@reactant/context';

const { paths } = getContext();

configure(
  require.context(
    path.resolve(paths.root, 'src'),
    true,
    /\.stories\.(j|t)sx?$/
  ),
  module
);
