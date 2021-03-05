import React from 'react';
import MainStackNavigator from './src/navigation/MainStackNavigator';
console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return <MainStackNavigator />;
  }
}