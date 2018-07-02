import { configure } from '@storybook/react';

// const req = require.context(
//   '/home/codejamninja/Projects/reaction/storybook/stories',
//   true,
//   /[^/]+\/index.web\.js$/
// );

configure(() => {
  // req.keys().forEach(path => req(path));
  // eslint-disable-next-line
  require('/home/codejamninja/Projects/reaction/storybook/stories');
}, module);
