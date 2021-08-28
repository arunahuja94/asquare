import React from 'react';
import { LogBox} from 'react-native';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import setI18nConfig from './src/Utils/appLanguage';
LogBox.ignoreAllLogs();
export default class App extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
  }
  render() {
    return <MainStackNavigator />;
  }
}