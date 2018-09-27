import React, { Component } from 'react';
import { Text } from 'native-base';
import { MainContent } from '~/components';

export default class NotFound extends Component {
  render() {
    return (
      <MainContent style={{ alignItems: 'center' }}>
        <Text>Not Found</Text>
      </MainContent>
    );
  }
}
