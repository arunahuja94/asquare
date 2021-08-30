import React from 'react';
import {LogBox} from 'react-native';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import AuthProvider from './src/store/authProvider';
import setI18nConfig from './src/Utils/appLanguage';
import JailMonkey from 'jail-monkey';
import JailBreakScreen from './src/screens/JailBreak';
LogBox.ignoreAllLogs();
setI18nConfig();

function App() {
  if (JailMonkey.isJailBroken()) {
    return JailBreakScreen();
  }

  return (
    <AuthProvider>
      <MainStackNavigator />
    </AuthProvider>
  );
}

export default App;
