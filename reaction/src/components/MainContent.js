import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Content, Header, Text, View } from 'native-base';
import { config, Link } from 'reaction-base';

export default class MainContent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  render() {
    return (
      <Container>
        <Header
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Link to="/home">
            <Text style={{ fontSize: 24 }}>{config.title}</Text>
          </Link>
        </Header>
        <Content>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                ...this.props.style,
                padding: 10,
                maxWidth: 720,
                width: '100%'
              }}
            >
              {this.props.children}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
