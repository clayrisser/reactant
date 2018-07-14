import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'reaction-base';
import { Text, View } from 'native-base';

export default class Splash extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { history } = this.props;
    setTimeout(() => {
      history.push('/todo-list');
    }, 3000);
  }

  render() {
    return (
      <View>
        <Text>Loading . . .</Text>
        <Link to="/todo-list">
          <Text>ToDo List</Text>
        </Link>
      </View>
    );
  }
}
