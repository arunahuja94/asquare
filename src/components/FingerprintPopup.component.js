import React, {useEffect} from 'react';
import {
  ToastAndroid,
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import FingerprintScanner from 'react-native-fingerprint-scanner';
import styles from './FingerprintPopup.component.styles';

// Based on https://github.com/hieuvp/react-native-fingerprint-scanner/blob/master/examples/src/FingerprintPopup.component.android.js
// - this example component supports both the legacy device-specific (Android < v23) and
//   current (Android >= 23) biometric APIs
// - your lib and implementation may not need both

function FingerprintPopup(props) {
  const [errorMessageLegacy, errorMessageLegacyUpdate] = React.useState(
    undefined,
  );
  const [biometricLegacy, biometricLegacyUpdate] = React.useState(undefined);
  const [description, descriptionUpdate] = React.useState('');

  useEffect(() => {
    function authCurrent() {
      FingerprintScanner.authenticate({
        title: 'Unlock asquare',
        description: props.description || 'Log in with Biometrics',
        cancelButton: 'Use Password',
      })
        .then(() => {
          props.onAuthenticate(true);
          console.log('fingerprint true');
        })
        .catch((error) => {
          if (error.name == 'UserCancel') {
            props.handlePopupDismissed();
          } else if ((error.name = 'DeviceLocked')) {
            ToastAndroid.showWithGravityAndOffset(
              'Please try after 30sec',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            props.handlePopupDismissed();
          } else {
            console.log(error);
          }
        });
    }

    if (Platform.Version < 23) {
    } else {
      authCurrent();
    }

    return function cleanup() {
      FingerprintScanner.release();
    };
  });

  if (Platform.Version < 23) {
    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, props.style]}>
          <Image
            style={styles.logo}
            source={require('../assets/img/finger_print.png')}
          />

          <Text style={styles.heading}>Biometric{'\n'}Authentication</Text>
          <Text>Old Device</Text>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={props.handlePopupDismissed}>
            <Text style={styles.buttonText}>BACK TO MAIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

export default FingerprintPopup;
