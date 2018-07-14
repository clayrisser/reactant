import React, { Component } from 'react';
import { List } from 'native-base';
import autobind from 'autobind-decorator';
import TodoItem from '~/components/TodoItem';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateTmp } from '~/actions/tmp';

@autobind
class TodoList extends Component {
  static propTypes = {
    updateTmp: PropTypes.func.isRequired
  };

  handlePress() {
    this.props.updateTmp('boo', { hello: 'world' });
  }

  render() {
    return (
      <List>
        <TodoItem>Clean the Kitchen</TodoItem>
        <TodoItem finished>Make the Bed</TodoItem>
        <TodoItem>Eat Breakfast</TodoItem>
      </List>
    );
  }
}

export default connect(
  () => {},
  dispatch => ({
    updateTmp: (...args) => dispatch(updateTmp(...args))
  })
)(TodoList);
