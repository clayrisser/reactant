import React, { FC } from 'react';
import PlatformApi from './platformApi';

export interface PlatformProps {
  [key: string]: any;
}

const Platform: FC<PlatformProps> = props => {
  let SharedSrc = require('@reactant/src');
  if (SharedSrc.__esModule && SharedSrc.default) SharedSrc = SharedSrc.default;
  return <SharedSrc {...props} />;
};

export { PlatformApi };
export * from './types';
export default Platform;
