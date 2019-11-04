import React, { FC, ReactNode } from 'react';

export interface AppProps {
  children?: ReactNode;
}

const Text: FC<AppProps> = (props: AppProps) => (
  <p {...props}>{props.children}</p>
);

Text.defaultProps = {
  children: null
};

export default Text;
