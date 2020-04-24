import React, { FC } from 'react';

export interface ReactantProps {
  [key: string]: any;
}

const Reactant: FC<ReactantProps> = (props: ReactantProps) => {
  // eslint-disable-next-line global-require
  let SharedSrc = require('~');
  if (SharedSrc.__esModule && SharedSrc.default) SharedSrc = SharedSrc.default;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <SharedSrc {...props} />;
};

export default Reactant;
