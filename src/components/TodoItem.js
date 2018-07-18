import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Text, CheckBox, ListItem, Button } from 'native-base';

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

  constructor(props) {
    super(props);
    this.state = {
      finished: props.finished
    };
  }

  handleToggle() {
    const { finished } = this.state;
    this.props.onToggle(this.props.id);
    this.setState({ finished: !finished });
  }

  handleDelete() {
    this.props.onDelete(this.props.id);
  }

  render() {
    const { children } = this.props;
    const { finished } = this.state;
    return (
      <ListItem onPress={this.handleToggle}>
        <CheckBox checked={finished} />
        <Text>{children}</Text>
        <Button onPress={this.handleDelete}>Del</Button>
      </ListItem>
    );
  }
}
