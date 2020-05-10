import PlatformReactant from '@reactant/platform/Reactant';
import React, { FC } from 'react';
import { hot } from 'react-hot-loader';

export interface ReactantProps {
  [key: string]: any;
}

const Reactant: FC<ReactantProps> = (props: ReactantProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <PlatformReactant {...props} />
);

export default hot(module)(Reactant);
