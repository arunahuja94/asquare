import React from 'react';
import {StatusBar, ToastAndroid} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
export function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

export const globalToast = (message) => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};
