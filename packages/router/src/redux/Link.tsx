import React, { FC, ReactNode } from 'react';
import { CallHistoryMethodAction, push } from 'connected-react-router';
import { LocationState, Path } from 'history';
import { connect } from '@reactant/redux';
// eslint-disable-next-line import/no-unresolved
import View from './View';

export interface LinkProps {
  children: ReactNode;
  style?: any;
  push: (path: Path) => CallHistoryMethodAction<[Path, LocationState?]>;
  to: Path;
}

const Link: FC<LinkProps> = (props: LinkProps) => {
  function handlePress() {
    props.push(props.to);
  }

  return (
    <View onPress={handlePress} style={props.style}>
      {props.children}
    </View>
  );
};

export default connect(null, { push })(Link);
