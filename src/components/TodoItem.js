import React, { Component } from 'react';
import { Container, Content, Text, CheckBox, ListItem } from 'native-base';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';

@autobind
export default class TodoItem extends Component {
  static propTypes = {
    children: PropTypes.string
  };
  static defaultProps = {
    children: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      finished: props.finished
    };
  }

  handlePress() {
    this.setState({ finished: !this.state.finished });
  }

  render() {
    return (
      <Content>
        <ListItem onPress={this.handlePress}>
          <CheckBox checked={this.state.finished} />
          <Text>{this.props.children}</Text>
        </ListItem>
      </Content>
    );
  }
}
