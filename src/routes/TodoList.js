import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autobind from 'autobind-decorator';
import {
  List,
  View,
  InputGroup,
  Input,
  Text,
  Button,
  Container,
  Content,
  Form,
  Item
} from 'native-base';
import { connect } from 'react-redux';
import { runtime } from 'js-info';
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

  state = {
    todo: ''
  };

  handleToggle(todoId) {
    this.props.toggleTodo(todoId);
  }

  handleDelete(todoId) {
    this.props.delTodo(todoId);
  }

  handleAddTodo() {
    this.props.addTodo(this.state.todo);
    this.setState({ todo: '' });
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

  renderInput() {
    if (runtime.reactNative) {
      return (
        <Form style={{ width: '80%' }}>
          <Item style={{ width: '100%' }}>
            <Input
              value={this.state.todo}
              placeholder="Todo Item"
              onChangeText={todo => this.setState({ todo })}
            />
          </Item>
        </Form>
      );
    }
    return (
      <InputGroup>
        <Input
          value={this.state.todo}
          placeholder="Todo Item"
          onChangeText={todo => this.setState({ todo })}
        />
      </InputGroup>
    );
  }

  render() {
    return (
      <Container>
        <Content>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            {this.renderInput()}
            <Button onPress={this.handleAddTodo}>
              <Text>Add</Text>
            </Button>
          </View>
          <List>{this.renderTodos()}</List>
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
