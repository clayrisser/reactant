import React, { FC } from 'react';

export interface ReactantProps {
  [key: string]: any;
}

const Reactant: FC<ReactantProps> = props => {
  let SharedSrc = require('@reactant/src');
  if (SharedSrc.__esModule && SharedSrc.default) SharedSrc = SharedSrc.default;
  return <SharedSrc {...props} />;
};

export default Reactant;
