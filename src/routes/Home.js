import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import { List } from 'native-base';
import { connect } from 'react-redux';
import { MainContent, AddTodo, TodoItem } from '~/components';
import { addTodo, delTodo, toggleTodo } from '~/actions/todos';

@autobind
class Home extends Component {
  static propTypes = {
    addTodo: PropTypes.func.isRequired,
    delTodo: PropTypes.func.isRequired,
    todos: PropTypes.array.isRequired,
    toggleTodo: PropTypes.func.isRequired
  };

  handleToggle(todoId) {
    this.props.toggleTodo(todoId);
  }

  handleDelete(todoId) {
    this.props.delTodo(todoId);
  }

  handleAddTodo(todo) {
    this.props.addTodo(todo);
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
    return (
      <MainContent>
        <AddTodo onPress={this.handleAddTodo} />
        <List>{this.renderTodos()}</List>
      </MainContent>
    );
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
)(Home);
