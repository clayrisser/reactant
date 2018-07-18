import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Text, CheckBox, ListItem, Icon, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { runtime } from 'js-info';

@autobind
export default class TodoItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onToggle: PropTypes.func,
    onDelete: PropTypes.func,
    children: PropTypes.string,
    finished: PropTypes.bool
  };

  static defaultProps = {
    onDelete: f => f,
    onToggle: f => f,
    children: '',
    finished: false
  };

  handleToggle() {
    this.props.onToggle(this.props.id);
  }

  handleDelete() {
    this.props.onDelete(this.props.id);
  }

  render() {
    const { children, finished } = this.props;
    return (
      <ListItem>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
            onPress={this.handleToggle}
          >
            <CheckBox checked={finished} style={{ width: 20 }} />
            <Text style={{ paddingLeft: runtime.reactNative ? 20 : 10 }}>
              {children}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleDelete}>
            <Icon name="ios-trash" />
          </TouchableOpacity>
        </View>
      </ListItem>
    );
  }
}
