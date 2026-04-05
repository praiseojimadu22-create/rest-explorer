import React from 'react';
import {StatusBar} from 'react-native';
import Navigator from './src/navigation/Navigator';

export default function App(): React.JSX.Element {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0d0f14" />
      <Navigator />
    </>
  );
}
