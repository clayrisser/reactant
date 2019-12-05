import PropTypes from 'prop-types';
import React, { FC, ReactNode } from 'react';
import { Path, Route, Router, Switch, Link } from '@reactant/router';
import { connect } from 'react-redux';
import { push } from '@reactant/router/redux';
import { storeContext } from '@reactant/redux/thunk';

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

Routes.contextTypes = {
  store: PropTypes.object.isRequired
};

Routes.defaultProps = {
  children: 'Hello, reactant!'
};

export default connect(null, { push }, null, { context: storeContext })(Routes);
/* export default Routes; */
