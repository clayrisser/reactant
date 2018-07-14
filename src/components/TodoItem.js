import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Text, CheckBox, ListItem } from 'native-base';

@autobind
export default class TodoItem extends Component {
  static propTypes = {
    children: PropTypes.string,
    finished: PropTypes.bool
  };

  static defaultProps = {
    children: '',
    finished: false
  };

  constructor(props) {
    super(props);
    this.state = {
      finished: props.finished
    };
  }

  handlePress() {
    const { finished } = this.state;
    this.setState({ finished: !finished });
  }

  render() {
    const { children } = this.props;
    const { finished } = this.state;
    return (
      <ListItem onPress={this.handlePress}>
        <CheckBox checked={finished} />
        <Text>{children}</Text>
      </ListItem>
    );
  }
}
