import React from 'react';
/* import context from '@reactant/context'; */

/* console.log(context); */
// @ts-ignore
/* console.log(context()); */

export default { title: 'Button' };

export const withText = () => <button>Hello Button</button>;

export const withEmoji = () => (
  <button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </button>
);

// @ts-ignore
console.log(__REACTANT__);
