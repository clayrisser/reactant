import React, { Component } from 'react';
import { Text, Content } from 'native-base';
import { Link } from 'reaction-base';

export default class Splash extends Component {
  render() {
    return (
      <Content>
        <Text>Loading . . .</Text>
        <Link to="/todo-list">
          <Text>ToDo List</Text>
        </Link>
      </Content>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.history.push('/todo-list');
    }, 3000);
  }
}
