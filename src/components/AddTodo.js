import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Input, Icon, View } from 'native-base';
import { TouchableOpacity } from 'react-native';

@autobind
export default class AddTodo extends Component {
  static propTypes = {
    onPress: PropTypes.func
  };

  static defaultProps = {
    onPress: f => f
  };

  state = {
    todo: ''
  };

  handlePress() {
    const { todo } = this.state;
    if (todo.length) {
      this.setState({ todo: '' });
      this.props.onPress(todo);
    }
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingRight: 5
        }}
      >
        <View style={{ width: '100%', flex: -1, marginRight: 10 }}>
          <Input
            value={this.state.todo}
            placeholder="Todo Item"
            onChangeText={todo => this.setState({ todo })}
          />
        </View>
        <TouchableOpacity
          style={{ justifyContent: 'center' }}
          onPress={this.handlePress}
        >
          <Icon name="md-add-circle" />
        </TouchableOpacity>
      </View>
    );
  }
}
