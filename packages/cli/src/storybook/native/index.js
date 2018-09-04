import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import { config } from '@reactant/base';
import stories from '~/../stories';

configure(() => stories, module);

const StorybookUIRoot = getStorybookUI({
  port: config.ports.storybookNative,
  onDeviceUI: true
});

class StorybookUIHMRRoot extends Component {
  render() {
    return <StorybookUIRoot />;
  }
}

AppRegistry.registerComponent(config.moduleName, () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
