import { Component } from 'react';
import PropTypes from 'prop-types';

export default class DynamicComponentReact extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired
  };

  state = {
    component: null
  };

  async componentDidMount() {
    const component = await this.props.load();
    this.setState({
      component: component.default ? component.default : component
    });
  }

  render() {
    return this.props.children(this.state.component);
  }
}
