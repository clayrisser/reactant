import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { View } from 'native-base';
import style from './style';

function StorybookViewWrapper(props) {
  class StorybookView extends Component {
    static propTypes = {
      children: PropTypes.node,
      context: PropTypes.object.isRequired
    };

    static defaultProps = {
      children: null
    };

    getChildContext() {
      return this.props.context;
    }

    componentWillMount() {
      // eslint-disable-next-line global-require
      const rootStyle = require('~/../web/styles/root.scss?root=./web/styles/');
      this.removeCss = insertCss(rootStyle);
    }

    componentWillUnmount() {
      if (this.removeCss) this.removeCss();
    }

    render() {
      const { children } = this.props;
      return <View style={style.main}>{children}</View>;
    }
  }
  const childContextTypes = {};
  _.each(props.context, (item, key) => {
    if (_.isArray(item)) {
      return (childContextTypes[key] = PropTypes.array.isRequired);
    }
    if (_.isFunction(item)) {
      return (childContextTypes[key] = PropTypes.func.isRequired);
    }
    return (childContextTypes[key] = PropTypes[typeof item].isRequired);
  });
  StorybookView.childContextTypes = childContextTypes;
  return <StorybookView {...props} />;
}

StorybookViewWrapper.propTypes = {
  context: PropTypes.object
};
StorybookViewWrapper.defaultProps = {
  context: {}
};

function insertCss(...styles) {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(f => f());
}

export default StorybookViewWrapper;
