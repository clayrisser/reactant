/* import Link from '@reactant/router/Link'; */
import React, { FC, ReactNode } from 'react';
import { Route, Switch, Router, Link } from '@reactant/router';
import { storeContext } from '@reactant/redux/thunk';
import { connect } from '@reactant/redux';
import { Path } from '@reactant/router';
import { push } from '@reactant/router/lib/withProvider';

export interface RoutesProps {
  children?: ReactNode;
  push: (path: Path) => any;
}

const Routes: FC<RoutesProps> = (props: RoutesProps) => {
  function handleClick() {
    console.log('hello');
    props.push('/about');
  }

  return (
    <Router>
      <div onClick={handleClick}>hi</div>
      <Link to="/about">About</Link>
      <Link to="/users">Users</Link>
      <Link to="/">Home</Link>
      {props.children}
      <Switch>
        <Route path="/about">About</Route>
        <Route path="/users">Users</Route>
        <Route path="/">Home</Route>
      </Switch>
    </Router>
  );
};

Routes.defaultProps = {
  children: 'Hello, reactant!'
};

export default connect(null, { push }, null, { context: storeContext })(Routes);
/* export default Routes; */