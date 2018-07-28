import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import { Container, Content, List, View, Header, Text } from 'native-base';
import { config } from 'reaction-base';
import { connect } from 'react-redux';
import AddTodo from '~/components/AddTodo';
import TodoItem from '~/components/TodoItem';
import { addTodo, delTodo, toggleTodo } from '~/actions/todos';

@autobind
class TodoList extends Component {
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
      <Container>
        <Header
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ fontSize: 24 }}>{config.title}</Text>
        </Header>
        <Content>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                padding: 10,
                maxWidth: 720,
                width: '100%'
              }}
            >
              <AddTodo onPress={this.handleAddTodo} />
              <List>{this.renderTodos()}</List>
            </View>
          </View>
        </Content>
      </Container>
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
)(TodoList);
