import React, { FC, ReactNode } from 'react';
import { Text, View } from 'react-native';

export interface AppProps {
  children?: ReactNode;
}

const App: FC<AppProps> = (_props: AppProps) => (
  <View>
    <Text>Open up App.tsx to start working on your app!</Text>
  </View>
);

export default App;
