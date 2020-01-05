import React from 'react';
import getConfig from '@reactant/config';
import getContext from '@reactant/context';

console.log(getContext());
console.log(getConfig());

export default { title: 'Button' };

export const withText = () => <button>Hello Button</button>;

export const withEmoji = () => (
  <button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </button>
);
