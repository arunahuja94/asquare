import React, {useEffect, useContext} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  AppState,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Icon from '../components/icons';
import styles from './SignInScreen.styles';
import FingerprintPopup from '../components/FingerprintPopup.component';
import {FocusAwareStatusBar} from '../constants/helper';
import {AuthContext} from '../store/authContext';
import {Formik} from 'formik';
function SignInScreen() {
  const { authState, authActions } = useContext(AuthContext);
  const [errorMessage, errorMessageUpdate] = React.useState(undefined);
  const [biometric, biometricUpdate] = React.useState(undefined);
  const [appState, appStateUpdate] = React.useState('');
  useEffect(() => {
    function detectFingerprintAvailable() {
      FingerprintScanner.isSensorAvailable().catch(function (error) {
        // console.log(error,error.name);
        if (error.name == 'FingerprintScannerNotEnrolled') {
          errorMessageUpdate(
            'Please Use Master password because Fingerprint Scanner has no enrolled fingers.',
          );
        } else {
          errorMessageUpdate(error.message);
        }
        biometricUpdate(error.biometric);
      });
    }

    function handleAppStateChange(nextAppState) {
      if (
        appState &&
        appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        FingerprintScanner.release();
        detectFingerprintAvailable();
      }
      //this.setState({ appState: nextAppState });
      appStateUpdate(nextAppState);
    }

    AppState.addEventListener('change', handleAppStateChange);
    // Get initial fingerprint enrolled
    detectFingerprintAvailable();

    // Specify how to clean up after this effect:
    return function cleanup() {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  });
  const [popupShowed, popupShowedUpdate] = React.useState(false);
  function handleFingerprintShowed() {
    popupShowedUpdate(true);
  }

  function handleFingerprintDismissed() {
    popupShowedUpdate(false);
  }

  function onAuthenticate(data) {
    authActions.signIn(data, '', 'fp');
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={{flex: 3, width: 300, height: 70}}>
        <Image
          resizeMode={'contain'}
          style={styles.logo_style}
          source={require('../assets/img/logo2-darkbg.png')}
        />
      </View>
      <View style={{flex: 3, alignItems: 'center'}}>
        <View
          style={{
            width: 350,
            backgroundColor: '#212121',
            elevation: 7,
            borderRadius: 15 / 2,
          }}>
          <Formik
            initialValues={{password: ''}}
            onSubmit={(values, actions) => authActions.signIn(values, actions, 'mp')}>
            {({handleChange, handleBlur, handleSubmit, values}) => (
              <View>
                <TextInput
                keyboardType="numeric"
                  placeholder="Master password"
                  placeholderTextColor="#fff"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={true}
                  style={{fontSize: 20, textAlign: 'center', color: '#fff'}}
                  value={values.password}
                  onSubmitEditing={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </View>

        <TouchableOpacity
          style={styles.fingerprint}
          onPress={handleFingerprintShowed}
          disabled={!!errorMessage}>
          <Icon.Ionicons
            color="#37ac57"
            name="finger-print-outline"
            size={30}
          />
          <Text style={styles.ftext}>USE FINGERPRINT</Text>
        </TouchableOpacity>
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </View>

      {popupShowed && (
        <FingerprintPopup
          style={styles.popup}
          onAuthenticate={onAuthenticate}
          description={'Confirm your screen lock pin or password'}
          handlePopupDismissed={handleFingerprintDismissed}
        />
      )}
    </KeyboardAvoidingView>
  );
}

export default SignInScreen;
