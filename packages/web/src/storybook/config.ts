// import fs from 'fs-extra';
// import path from 'path';
import { configure } from '@storybook/react';
// import { getContext } from '@reactant/context';
// import context from '@reactant/context';

// console.log(context);

// const context = getContext();
// const configPath = path.resolve(context.paths.root, 'storybook/config.js');
// // eslint-disable-next-line import/no-dynamic-require,global-require
// if (fs.pathExistsSync(configPath)) require(configPath);
// console.log(fs.pathExistsSync(configPath), configPath);

configure(
  // @ts-ignore
  require.context('../../../../../src', true, /\.stories\.(j|t)sx?$/),
  module
);
