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
      <ListItem
        style={{
          marginLeft: 0,
          paddingBottom: 5,
          paddingLeft: 5,
          paddingRight: 5
        }}
      >
        <TouchableOpacity
          onPress={this.handleToggle}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <View
              style={{
                width: runtime.reactNative ? 20 : null
              }}
            >
              <CheckBox
                checked={finished}
                style={{
                  marginLeft: runtime.reactNative ? -10 : null
                }}
              />
            </View>
            <Text style={{ paddingLeft: 10 }}>{children}</Text>
          </View>
          <TouchableOpacity onPress={this.handleDelete}>
            <Icon name="ios-trash" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ListItem>
    );
  }
}
