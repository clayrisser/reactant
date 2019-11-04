import React, { FC, ReactNode } from 'react';

export interface AppProps {
  children?: ReactNode;
  style?: object;
}

const View: FC<AppProps> = (props: AppProps) => (
  <div {...props}>{props.children}</div>
);

View.defaultProps = {
  children: null,
  style: {}
};

export default View;
