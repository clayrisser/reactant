import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Input, Text, View } from 'native-base';

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
    this.setState({ todo: '' });
    this.props.onPress(this.state.todo);
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row'
        }}
      >
        <View
          style={{
            width: '70%'
          }}
        >
          <Input
            value={this.state.todo}
            placeholder="Todo Item"
            onChangeText={todo => this.setState({ todo })}
          />
        </View>
        <View
          style={{
            width: '30%',
            alignItems: 'flex-end'
          }}
        >
          <Button
            style={{
              width: '100%',
              justifyContent: 'center'
            }}
            onPress={this.handlePress}
          >
            <Text>Add</Text>
          </Button>
        </View>
      </View>
    );
  }
}
