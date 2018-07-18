import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import { List } from 'native-base';
import { connect } from 'react-redux';
import TodoItem from '~/components/TodoItem';
import { addTodo, delTodo, toggleTodo } from '~/actions/todos';

@autobind
class TodoList extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    toggleTodo: PropTypes.func.isRequired,
    delTodo: PropTypes.func.isRequired
  };

  handleToggle(todoId) {
    this.props.toggleTodo(todoId);
  }

  handleDelete(todoId) {
    this.props.delTodo(todoId);
  }

  renderTodos() {
    return _.map(this.props.todos, todo => (
      <TodoItem
        key={todo.id}
        id={todo.id}
        finished={todo.done}
        onToggle={this.handleToggle}
        onDelete={this.handleDelete}
      >
        {todo.name}
      </TodoItem>
    ));
  }

  render() {
    return <List>{this.renderTodos()}</List>;
  }
}

export default connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    addTodo: (...args) => dispatch(addTodo(...args)),
    delTodo: (...args) => dispatch(delTodo(...args)),
    toggleTodo: (...args) => dispatch(toggleTodo(...args))
  })
)(TodoList);
