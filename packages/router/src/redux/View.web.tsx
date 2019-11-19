import React, { FC, ReactNode } from 'react';

export interface ViewProps {
  children?: ReactNode;
  onPress?: (e: Event) => void;
  style?: any;
}

// eslint-disable-next-line react/jsx-props-no-spreading
const View: FC<ViewProps> = (props: ViewProps) => <div {...props} />;

export default View;
