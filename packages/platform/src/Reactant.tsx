import React, { FC } from 'react';

export interface PlatformProps {
  [key: string]: any;
}

const Reactant: FC<PlatformProps> = props => {
  let SharedSrc = require('@reactant/src');
  if (SharedSrc.__esModule && SharedSrc.default) SharedSrc = SharedSrc.default;
  return <SharedSrc {...props} />;
};

export default Reactant;
